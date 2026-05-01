import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache to reuse the connection across Vercel serverless invocations.
 * `global.mongoose` persists between warm Lambda invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Guard: fail fast with a clear message if the URI is missing or still a placeholder
  if (!MONGODB_URI) {
    throw new Error(
      'MONGODB_URI environment variable is not set. ' +
      'Add it to .env.local (dev) or Vercel project settings (prod).'
    );
  }

  if (MONGODB_URI.includes('<password>')) {
    throw new Error(
      'MONGODB_URI still contains the <password> placeholder. ' +
      'Replace it with your actual MongoDB Atlas password.'
    );
  }

  // Return the cached connection if it is already established
  if (cached.conn) {
    return cached.conn;
  }

  // Only create one connection promise — subsequent calls wait on the same promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,          // Don't buffer ops while reconnecting
      maxPoolSize: 10,                // Vercel functions can share up to 10 sockets
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log('[MongoDB] Connecting...');
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('[MongoDB] Connected successfully');
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset the promise so the next request can retry
        cached.promise = null;
        console.error('[MongoDB] Connection failed:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;