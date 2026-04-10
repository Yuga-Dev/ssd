import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDatabase() {
  const uri = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/imposter';
  
  if (!uri) {
    console.warn('[MongoDB] Target URI missing, utilizing local database proxy.');
  }
  
  try {
    await mongoose.connect(uri);
    console.log('[MongoDB] Connection successfully resolved.');
  } catch (error) {
    console.error('[MongoDB] Connection Failed: ', error);
  }
}
