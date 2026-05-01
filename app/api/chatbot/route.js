import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getUserFromToken, requireManagerOrAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    const { message } = await request.json();
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json({ 
        reply: "AI is not configured yet. Please add GEMINI_API_KEY in your Vercel environment variables.",
        actionPerformed: false 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Check if user is admin/manager (for write operations)
    const isAdmin = await requireManagerOrAdmin();
    
    let context = "No inventory data available.";
    let dbConnected = false;
    
    try {
      await connectToDatabase();
      dbConnected = true;
      const products = await Product.find({}, 'name brand stockQuantity price category').limit(100);
      if (products.length > 0) {
        context = products.map(p => 
          `${p.name} (${p.brand || 'No brand'}) | ₹${p.price} | Stock: ${p.stockQuantity} | Category: ${p.category}`
        ).join('\n');
      }
    } catch (dbErr) {
      console.warn('DB not available for chatbot:', dbErr.message);
    }

    const prompt = `You are "Saurabh AI", the smart inventory assistant for Saurabh Provision store in Malegaon, India.
You help the shop owner manage inventory, check stock levels, and answer questions about the store.

Current Inventory:
${context}

User is ${isAdmin ? 'an ADMIN (can modify stock)' : 'a CUSTOMER (read-only access)'}.
Database connected: ${dbConnected}

User Message: "${message}"

Instructions:
1. If user asks about stock/products → answer from inventory data
2. If user wants to UPDATE stock and is ADMIN → return an ACTION
3. If user wants to UPDATE stock but is NOT ADMIN → politely say they need admin access
4. Keep responses SHORT and helpful (2-3 sentences max)
5. Use ₹ for prices, speak naturally

If an action is needed, add it on a new line starting with ACTION_JSON:
ACTION_JSON:{"action":"update_stock","productName":"exact name","quantity":10,"relative":false}

Actions available:
- update_stock: Set or add stock. Use relative=true to ADD to existing, false to SET absolute value
- add_product: {"action":"add_product","name":"name","price":100,"mrp":110,"category":"Grocery","stockQuantity":10}

Your response (text only, no ACTION_JSON if no action needed):`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse response and action
    const lines = text.split('\n');
    const actionLine = lines.find(l => l.trim().startsWith('ACTION_JSON:'));
    const responseLines = lines.filter(l => !l.trim().startsWith('ACTION_JSON:'));
    const responseText = responseLines.join('\n').trim() || "I processed your request.";
    
    let actionPerformed = false;
    
    if (actionLine && isAdmin && dbConnected) {
      try {
        const actionJson = actionLine.replace('ACTION_JSON:', '').trim();
        const action = JSON.parse(actionJson);
        
        if (action.action === 'update_stock') {
          const product = await Product.findOne({ 
            name: { $regex: new RegExp(action.productName, 'i') } 
          });
          
          if (product) {
            if (action.relative) {
              product.stockQuantity += action.quantity;
            } else {
              product.stockQuantity = action.quantity;
            }
            if (product.stockQuantity <= 0) {
              product.inStock = false;
              product.availabilityStatus = 'Out of Stock';
            } else {
              product.inStock = true;
              product.availabilityStatus = 'In Stock';
            }
            await product.save();
            actionPerformed = true;
          }
        } else if (action.action === 'add_product') {
          await Product.create({
            name: action.name,
            price: action.price,
            mrp: action.mrp || action.price,
            category: action.category || 'Grocery',
            stockQuantity: action.stockQuantity || 10,
            inStock: true,
            availabilityStatus: 'In Stock'
          });
          actionPerformed = true;
        }
      } catch (actionErr) {
        console.error('Action execution error:', actionErr);
      }
    }

    return NextResponse.json({
      reply: responseText,
      actionPerformed
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({ 
      reply: "Sorry, I ran into an issue. Please try again.",
      actionPerformed: false 
    });
  }
}
