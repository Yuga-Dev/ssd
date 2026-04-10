import { Client, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT || 'YOUR_PROJECT_ID'); // Replace with actual project ID

const databases = new Databases(client);

export { client, databases };
