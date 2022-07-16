import {
  Account,
  Client,
  Databases,
  Storage,
} from 'appwrite';
import { fetchEnv } from './utils/env';

const client = new Client();

client
  .setEndpoint(fetchEnv('VITE_APPWRITE_ENDPOINT'))
  .setProject(fetchEnv('VITE_APPWRITE_PROJECT_ID'));

const account = new Account(client);
const database = new Databases(client, fetchEnv('VITE_APPWRITE_DATABASE_ID'));
const storage = new Storage(client);

export {
  client,
  account,
  database,
  storage,
};
