import { MongoClient, ServerApiVersion } from 'mongodb';

export const BASE_API_HANDLERS_URI =
  'mongodb+srv://Dopamine-s:Ro75ZTssxvZGW1P2@cluster0.e7nhbaz.mongodb.net/events?retryWrites=true&w=majority';

export function createMongoClient(uri) {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  return client;
}

export async function insertDocumentIntoCollection(
  client,
  collection,
  document
) {
  await client.connect();
  const db = client.db();
  await db.collection(collection).insertOne(document);
}

export async function getCollection(client, collection) {
  await client.connect();
  const db = client.db();
  const data = await db.collection(collection).find();
  return data;
}
