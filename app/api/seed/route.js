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

    console.log('Seeding categories...');
    const categories = await Category.insertMany([
      { name: 'Grocery', icon: '🛒', slug: 'grocery' },
      { name: 'Stationery', icon: '✏️', slug: 'stationary' },
      { name: 'Fasting Items', icon: '🪔', slug: 'fasting' },
      { name: 'Snacks', icon: '🍿', slug: 'snacks' },
      { name: 'Daily Essentials', icon: '🧴', slug: 'daily' },
      { name: 'Beverages', icon: '🥤', slug: 'beverages' }
    ]).catch(err => { console.error('Category seed failed:', err); throw err; });

    console.log('Seeding products...');
    await Product.insertMany([
      { name: 'Tata Salt 1kg', price: 22, mrp: 25, discount: 12, category: 'Grocery', stockQuantity: 50, unit: 'kg', description: 'Pure iodized salt', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Aashirvaad Atta 5kg', price: 280, mrp: 310, discount: 10, category: 'Grocery', stockQuantity: 30, unit: 'kg', description: 'Premium wheat flour', featured: true, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: 'Amul Butter 500g', price: 275, mrp: 285, discount: 3, category: 'Grocery', stockQuantity: 25, unit: 'g', description: 'Fresh dairy butter', featured: true, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      { name: 'Fortune Sunflower Oil 1L', price: 145, mrp: 160, discount: 9, category: 'Grocery', stockQuantity: 40, unit: 'L', description: 'Refined sunflower oil', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Tata Tea Premium 250g', price: 120, mrp: 135, discount: 11, category: 'Beverages', stockQuantity: 35, unit: 'g', description: 'Premium tea leaves', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Parle-G Biscuits 800g', price: 85, mrp: 90, discount: 5, category: 'Snacks', stockQuantity: 60, unit: 'g', description: 'Classic glucose biscuits', featured: true, expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) },
      { name: 'Maggi Noodles 4-pack', price: 56, mrp: 60, discount: 6, category: 'Snacks', stockQuantity: 45, unit: 'pack', description: 'Instant noodles', featured: true, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: 'Kurkure Masala 90g', price: 20, mrp: 25, discount: 20, category: 'Snacks', stockQuantity: 80, unit: 'g', description: 'Spicy potato chips', featured: true, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { name: 'Rajgira Ladoo 250g', price: 120, mrp: 140, discount: 14, category: 'Fasting Items', stockQuantity: 20, unit: 'g', description: 'Traditional fasting sweet', featured: true, expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      { name: 'Sabudana Chips 100g', price: 40, mrp: 45, discount: 11, category: 'Fasting Items', stockQuantity: 25, unit: 'g', description: 'Crispy fasting snack', featured: true, expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) },
      { name: 'Sheera Mix 200g', price: 80, mrp: 90, discount: 11, category: 'Fasting Items', stockQuantity: 30, unit: 'g', description: 'Ready-to-cook sheera', expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
      { name: 'Fasting Chips 150g', price: 35, mrp: 40, discount: 12, category: 'Fasting Items', stockQuantity: 35, unit: 'g', description: 'Traditional fasting chips', expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
      { name: 'Classmate Notebook 200pg', price: 45, mrp: 55, discount: 18, category: 'Stationery', stockQuantity: 50, unit: 'pages', description: 'Long notebook', featured: true },
      { name: 'Reynolds Pen Pack 10', price: 30, mrp: 35, discount: 14, category: 'Stationery', stockQuantity: 100, unit: 'pack', description: 'Ball point pens', featured: true },
      { name: 'Coca Cola 500ml', price: 40, mrp: 45, discount: 11, category: 'Beverages', stockQuantity: 70, unit: 'ml', description: 'Cold drink', featured: true, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: 'Surf Excel 1kg', price: 235, mrp: 250, discount: 6, category: 'Daily Essentials', stockQuantity: 25, unit: 'kg', description: 'Laundry detergent', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Colgate Toothpaste 200g', price: 110, mrp: 120, discount: 8, category: 'Daily Essentials', stockQuantity: 40, unit: 'g', description: 'Toothpaste', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
      { name: 'Dettol Soap 75g', price: 42, mrp: 45, discount: 6, category: 'Daily Essentials', stockQuantity: 55, unit: 'g', description: 'Antibacterial soap', featured: true, expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
    ]).catch(err => { console.error('Product seed failed:', err); throw err; });

    console.log('Seeding admin...');
    const hashedPassword = await bcrypt.hash('Admin@1234', 10);
    await User.create({
      name: 'Vilas Yeole',
      email: 'vilas@saurabhprovision.com',
      phone: '9766689821',
      password: hashedPassword,
      role: 'admin',
      address: 'Saurabh Provision Store, Pune, Maharashtra'
    }).catch(err => { console.error('Admin seed failed:', err); throw err; });

    console.log('Seeding banner...');
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
    }).catch(err => { console.error('Banner seed failed:', err); throw err; });

    console.log('Seed completed successfully!');
    return NextResponse.json({ 
      success: true, 
      message: '✅ Database seeded! 18 products, 6 categories, 1 admin, 1 banner created.',
      adminEmail: 'vilas@saurabhprovision.com',
      adminPassword: 'Admin@1234'
    });
  } catch (error) {
    console.error('CRITICAL SEED ERROR:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
