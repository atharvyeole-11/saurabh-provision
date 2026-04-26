import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not defined. Application will run in Demo Mode with dummy data.');
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function connectToDatabase() {
  if (!MONGODB_URI || MONGODB_URI.includes('<password>')) {
    const msg = !MONGODB_URI ? 'MONGODB_URI is missing' : 'MONGODB_URI still has <password> placeholder';
    throw new Error(msg);
  }
  
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // 2 seconds timeout
      connectTimeoutMS: 2000,
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  
  return cached.conn;
}

export default connectToDatabase;