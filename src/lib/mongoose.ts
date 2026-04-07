// src/lib/mongoose.ts
// Singleton MongoDB connection using Mongoose ODM
// Imports: mongoose for database connection management

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://affliateApp:JI3uX6ufLJFSgyBN@ac-j8gotxu-shard-00-00.lxjhahz.mongodb.net:27017,ac-j8gotxu-shard-00-01.lxjhahz.mongodb.net:27017,ac-j8gotxu-shard-00-02.lxjhahz.mongodb.net:27017/music?ssl=true&replicaSet=atlas-zojvwq-shard-0&authSource=admin&appName=myCluster';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
