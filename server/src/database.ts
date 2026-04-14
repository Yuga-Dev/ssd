import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer: MongoMemoryServer;

export async function connectDatabase() {
  let uri = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn('[MongoDB] Target URI missing, utilizing local database proxy (MongoMemoryServer).');
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }
  
  try {
    await mongoose.connect(uri);
    console.log(`[MongoDB] Connection successfully resolved. ${!process.env.MONGODB_URI && !process.env.VITE_MONGODB_URI ? '(In-Memory)' : ''}`);
  } catch (error) {
    console.error('[MongoDB] Connection Failed: ', error);
  }
}
