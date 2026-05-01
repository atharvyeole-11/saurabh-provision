import { NextResponse } from 'next/server';
import { requireManagerOrAdmin } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    const isAuthorized = await requireManagerOrAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString('base64');

    const prompt = `You are an expert accountant analyzing a supplier bill/invoice for an Indian grocery store.
Extract ALL line items from this bill image.

Return ONLY a valid JSON array (no markdown, no backticks):
[
  {
    "name": "Product Name",
    "quantity": number,
    "price": number (per unit in rupees),
    "total": number (total amount for this line),
    "brand": "brand if visible"
  }
]

Rules:
- Extract EVERY line item, even partial ones
- Price should be in Indian Rupees
- If quantity is not clear, estimate from total/price
- Match names to common retail product names`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: imageFile.type } }
    ]);

    const text = result.response.text();
    
    // Extract JSON array
    let jsonStr = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    } else {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) jsonStr = jsonMatch[0];
    }
    
    const items = JSON.parse(jsonStr.trim());

    // Process items against database
    await connectToDatabase();
    const updates = [];
    
    for (const item of items) {
      // Find existing product by fuzzy name match
      let product = await Product.findOne({ 
        name: { $regex: new RegExp(item.name.split(' ').slice(0, 2).join('.*'), 'i') } 
      });

      if (product) {
        const oldStock = product.stockQuantity;
        product.stockQuantity += item.quantity;
        product.inStock = true;
        product.availabilityStatus = 'In Stock';
        await product.save();
        updates.push({ 
          name: product.name, 
          status: 'stock_updated', 
          oldStock,
          added: item.quantity,
          newStock: product.stockQuantity,
          matched: true
        });
      } else {
        updates.push({ 
          name: item.name, 
          status: 'not_found', 
          quantity: item.quantity,
          price: item.price,
          matched: false
        });
      }
    }

    const matched = updates.filter(u => u.matched).length;
    const unmatched = updates.filter(u => !u.matched).length;

    return NextResponse.json({
      success: true,
      items,
      updates,
      summary: {
        totalItems: items.length,
        matched,
        unmatched,
        message: `${matched} products updated, ${unmatched} need manual review`
      }
    });
  } catch (error) {
    console.error('Scan bill error:', error);
    return NextResponse.json({ error: 'Bill scanning failed', details: error.message }, { status: 500 });
  }
}
