import {
  createMongoClient,
  insertDocumentIntoCollection,
  getCollection,
} from '../../../helpers/db-utils';

const handlersUri = process.env.NEXT_PUBLIC_API_HANDLERS_URI;
const mongoClient = createMongoClient(handlersUri);

async function handler(req, res) {
  const eventId = req.query.eventId;

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid Input' });
      await mongoClient.close();
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    try {
      await insertDocumentIntoCollection(mongoClient, 'comments', newComment);
      res
        .status(201)
        .json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding comment!' });
    } finally {
      await mongoClient.close();
    }
  }

  if (req.method === 'GET') {
    try {
      const collection = await getCollection(mongoClient, 'comments', {
        eventId: eventId,
      });
      const result = await collection.sort({ _id: -1 }).toArray();
      res
        .status(200)
        .json({ message: 'Success fetching comments!', comments: result });
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json({ message: 'Error fetching comments!', comments: [] });
    } finally {
      await mongoClient.close();
    }
  }
}
export default handler;
