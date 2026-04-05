import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Banner from '@/models/Banner';
import Order from '@/models/Order';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Banner.deleteMany({});
    await Order.deleteMany({});

    const categories = await Category.insertMany([
      { name: 'Grocery', icon: '🛒', slug: 'grocery' },
      { name: 'Stationary', icon: '✏️', slug: 'stationary' },
      { name: 'Fasting Items', icon: '🪔', slug: 'fasting' },
      { name: 'Snacks', icon: '🍿', slug: 'snacks' },
      { name: 'Daily Needs', icon: '🧴', slug: 'daily' },
      { name: 'Beverages', icon: '🥤', slug: 'beverages' }
    ]);

    await Product.insertMany([
      { name: 'Tata Salt 1kg', price: 22, discount: 0, category: 'Grocery', inStock: true, description: 'Pure iodized salt' },
      { name: 'Aashirvaad Atta 5kg', price: 280, discount: 5, category: 'Grocery', inStock: true, description: 'Premium wheat flour' },
      { name: 'Amul Butter 500g', price: 275, discount: 0, category: 'Grocery', inStock: true, description: 'Fresh dairy butter' },
      { name: 'Fortune Sunflower Oil 1L', price: 145, discount: 8, category: 'Grocery', inStock: true },
      { name: 'Tata Tea Premium 250g', price: 120, discount: 5, category: 'Beverages', inStock: true },
      { name: 'Parle-G Biscuits 800g', price: 85, discount: 0, category: 'Snacks', inStock: true },
      { name: 'Maggi Noodles 4-pack', price: 56, discount: 0, category: 'Snacks', inStock: true },
      { name: 'Kurkure Masala 90g', price: 20, discount: 0, category: 'Snacks', inStock: true },
      { name: 'Rajgira Ladoo 250g', price: 120, discount: 10, category: 'Fasting Items', inStock: true, description: 'Traditional fasting sweet' },
      { name: 'Sabudana Chips 100g', price: 40, discount: 5, category: 'Fasting Items', inStock: true, description: 'Crispy fasting snack' },
      { name: 'Sheera Mix 200g', price: 80, discount: 0, category: 'Fasting Items', inStock: true, description: 'Ready-to-cook sheera' },
      { name: 'Fasting Chips 150g', price: 35, discount: 0, category: 'Fasting Items', inStock: true },
      { name: 'Classmate Notebook 200pg', price: 45, discount: 10, category: 'Stationary', inStock: true },
      { name: 'Reynolds Pen Pack 10', price: 30, discount: 0, category: 'Stationary', inStock: true },
      { name: 'Coca Cola 500ml', price: 40, discount: 0, category: 'Beverages', inStock: true },
      { name: 'Surf Excel 1kg', price: 235, discount: 5, category: 'Daily Needs', inStock: true },
      { name: 'Colgate Toothpaste 200g', price: 110, discount: 0, category: 'Daily Needs', inStock: true },
      { name: 'Dettol Soap 75g', price: 42, discount: 0, category: 'Daily Needs', inStock: true }
    ]);

    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    await User.create({
      name: 'Vilas Yeole',
      email: 'vilas@saurabhprovision.com',
      phone: '9766689821',
      password: hashedPassword,
      role: 'admin',
      address: 'Saurabh Provision Store, Pune, Maharashtra'
    });

    await Banner.create({
      title: '🪔 Navratri Special Offers!',
      subtitle: 'Fasting items available – Order now, pick up at your time!',
      festival: 'Navratri',
      bgColor: '#ea580c',
      isActive: true,
      products: [
        { name: 'Rajgira Ladoo', price: '₹120' },
        { name: 'Sabudana Chips', price: '₹40' },
        { name: 'Sheera Mix', price: '₹80' },
        { name: 'Fasting Chips', price: '₹35' }
      ],
      buttonText: 'Order Fasting Items',
      buttonLink: '/products?category=fasting'
    });

    return NextResponse.json({ 
      success: true, 
      message: '✅ Database seeded! 18 products, 6 categories, 1 admin, 1 banner created.',
      adminEmail: 'vilas@saurabhprovision.com',
      adminPassword: 'Admin@1234'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
