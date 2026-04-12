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
      { name: 'Tata Salt 1kg', price: 22, discount: 0, category: 'Grocery', stock: 50, unit: 'kg', description: 'Pure iodized salt', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Aashirvaad Atta 5kg', price: 280, discount: 5, category: 'Grocery', stock: 30, unit: 'kg', description: 'Premium wheat flour', featured: true, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: 'Amul Butter 500g', price: 275, discount: 0, category: 'Grocery', stock: 25, unit: 'g', description: 'Fresh dairy butter', featured: true, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { name: 'Fortune Sunflower Oil 1L', price: 145, discount: 8, category: 'Grocery', stock: 40, unit: 'L', description: 'Refined sunflower oil', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Tata Tea Premium 250g', price: 120, discount: 5, category: 'Beverages', stock: 35, unit: 'g', description: 'Premium tea leaves', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Parle-G Biscuits 800g', price: 85, discount: 0, category: 'Snacks', stock: 60, unit: 'g', description: 'Classic glucose biscuits', featured: true, expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
      { name: 'Maggi Noodles 4-pack', price: 56, discount: 0, category: 'Snacks', stock: 45, unit: 'pack', description: 'Instant noodles', featured: true, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: 'Kurkure Masala 90g', price: 20, discount: 0, category: 'Snacks', stock: 80, unit: 'g', description: 'Spicy potato chips', featured: true, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { name: 'Rajgira Ladoo 250g', price: 120, discount: 10, category: 'Fasting Items', stock: 20, unit: 'g', description: 'Traditional fasting sweet', featured: true, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      { name: 'Sabudana Chips 100g', price: 40, discount: 5, category: 'Fasting Items', stock: 25, unit: 'g', description: 'Crispy fasting snack', featured: true, expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) },
      { name: 'Sheera Mix 200g', price: 80, discount: 0, category: 'Fasting Items', stock: 30, unit: 'g', description: 'Ready-to-cook sheera', expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { name: 'Fasting Chips 150g', price: 35, discount: 0, category: 'Fasting Items', stock: 35, unit: 'g', description: 'Traditional fasting chips', expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      { name: 'Classmate Notebook 200pg', price: 45, discount: 10, category: 'Stationary', stock: 50, unit: 'pages', description: 'Long notebook', featured: true },
      { name: 'Reynolds Pen Pack 10', price: 30, discount: 0, category: 'Stationary', stock: 100, unit: 'pack', description: 'Ball point pens', featured: true },
      { name: 'Coca Cola 500ml', price: 40, discount: 0, category: 'Beverages', stock: 70, unit: 'ml', description: 'Cold drink', featured: true, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: 'Surf Excel 1kg', price: 235, discount: 5, category: 'Daily Needs', stock: 25, unit: 'kg', description: 'Laundry detergent', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Colgate Toothpaste 200g', price: 110, discount: 0, category: 'Daily Needs', stock: 40, unit: 'g', description: 'Toothpaste', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Dettol Soap 75g', price: 42, discount: 0, category: 'Daily Needs', stock: 55, unit: 'g', description: 'Antibacterial soap', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
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
