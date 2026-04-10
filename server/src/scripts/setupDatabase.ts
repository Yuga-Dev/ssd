import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT || '';
const apiKey = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'word_game_db';
const WORDS_COLLECTION_ID = process.env.VITE_APPWRITE_WORDS_COLLECTION_ID || 'words_col';

async function setup() {
  if (!projectId || !apiKey) {
    console.error("Missing Appwrite credentials block execution.");
    return;
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  const databases = new Databases(client);

  console.log(`Checking Database: ${DATABASE_ID}`);
  try {
    await databases.get(DATABASE_ID);
    console.log(`✅ Database ${DATABASE_ID} already exists.`);
  } catch (error: any) {
    if (error.code === 404) {
      console.log(`Database ${DATABASE_ID} not found. Creating...`);
      await databases.create(DATABASE_ID, 'Imposter Game Database');
      console.log(`✅ Database ${DATABASE_ID} created.`);
    } else {
      throw error;
    }
  }

  console.log(`Checking Collection: ${WORDS_COLLECTION_ID}`);
  try {
    await databases.getCollection(DATABASE_ID, WORDS_COLLECTION_ID);
    console.log(`✅ Collection ${WORDS_COLLECTION_ID} already exists.`);
  } catch (error: any) {
    if (error.code === 404) {
      console.log(`Collection ${WORDS_COLLECTION_ID} not found. Creating...`);
      await databases.createCollection(DATABASE_ID, WORDS_COLLECTION_ID, 'Words Collection');
      console.log(`✅ Collection ${WORDS_COLLECTION_ID} created.`);
      
      console.log('Creating attributes...');
      await databases.createStringAttribute(DATABASE_ID, WORDS_COLLECTION_ID, 'realWord', 255, true);
      await databases.createStringAttribute(DATABASE_ID, WORDS_COLLECTION_ID, 'imposterWord', 255, true);
      await databases.createBooleanAttribute(DATABASE_ID, WORDS_COLLECTION_ID, 'used', false, false);
      
      console.log(`✅ Attributes mapped successfully.`);
    } else {
      throw error;
    }
  }

  console.log("Appwrite structure provisioning complete!");
}

setup().catch(console.error);
