import { MongoClient, ServerApiVersion } from 'mongodb';

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

export async function getCollection(client, collection, filter = {}) {
  await client.connect();
  const db = client.db();
  const data = await db.collection(collection).find(filter);
  return data;
}
