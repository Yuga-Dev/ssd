import { Client, Databases, Query, ID } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT || '';
const apiKey = process.env.APPWRITE_API_KEY || '';

export const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';
export const WORDS_COLLECTION_ID = process.env.VITE_APPWRITE_WORDS_COLLECTION_ID || '';

const client = new Client();

if (endpoint && projectId && apiKey) {
  client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
} else {
  console.warn("Appwrite credentials (Endpoint, Project, API Key) are missing from environment.");
}

export const databases = new Databases(client);
export { ID, Query };
