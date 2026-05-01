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
      return NextResponse.json({ 
        error: 'GEMINI_API_KEY is not configured', 
        details: 'Add your Google AI Studio API key to Vercel environment variables.' 
      }, { status: 500 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert file to base64
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString('base64');

    const prompt = `
      You are a retail product scanner for an Indian grocery/stationery store.
      Analyze this image and extract product details.
      
      Return ONLY a valid JSON object (no markdown, no backticks):
      {
        "name": "Full Product Name with weight/quantity",
        "brand": "Brand Name (e.g., Tata, Fortune, Classmate)",
        "mrp": number (MRP in rupees, estimate if not visible),
        "price": number (suggested selling price, 5-10% less than MRP),
        "discount": number (percentage discount from MRP),
        "description": "One-line product description",
        "category": "one of: Grocery, Dairy, Snacks, Beverages, Fasting Items, Stationery, Household Items, Personal Care, Daily Essentials",
        "expiryDate": "YYYY-MM-DD if visible, otherwise empty string",
        "stockQuantity": 10
      }
      
      Important:
      - Prices should be realistic for Indian retail
      - If you can see MRP printed on product, use that exact number
      - If expiry date is visible, extract it precisely
      - Focus on the most prominent product if multiple are visible
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: imageFile.type } }
    ]);

    const text = result.response.text();
    
    // Extract JSON — handle markdown code blocks
    let jsonStr = text;
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
    } else {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) jsonStr = jsonMatch[0];
    }
    
    const extractedData = JSON.parse(jsonStr.trim());

    // Check if product already exists in DB
    let existingProduct = null;
    try {
      await connectToDatabase();
      existingProduct = await Product.findOne({ 
        name: { $regex: new RegExp(extractedData.name.split(' ').slice(0, 3).join('.*'), 'i') } 
      });
    } catch (dbErr) {
      console.warn('DB check skipped:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      existingProduct: existingProduct ? {
        _id: existingProduct._id,
        name: existingProduct.name,
        price: existingProduct.price,
        stockQuantity: existingProduct.stockQuantity
      } : null,
      isNew: !existingProduct,
      message: existingProduct 
        ? `"${existingProduct.name}" already exists (${existingProduct.stockQuantity} in stock). You can update it.`
        : `New product detected: ${extractedData.name}`
    });
  } catch (error) {
    console.error('Scan product error:', error);
    return NextResponse.json({ 
      error: 'AI scan failed', 
      details: error.message 
    }, { status: 500 });
  }
}
