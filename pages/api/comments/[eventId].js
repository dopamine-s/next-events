import { MongoClient, ServerApiVersion } from 'mongodb';

async function handler(req, res) {
  const eventId = req.query.eventId;
  const uri =
    'mongodb+srv://Dopamine-s:Ro75ZTssxvZGW1P2@cluster0.e7nhbaz.mongodb.net/events?retryWrites=true&w=majority';

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

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
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    try {
      await client.connect();
      const db = client.db();
      const commentsCollection = db.collection('comments');
      const result = await commentsCollection.insertOne(newComment);
      newComment.id = result.insertedId;
      console.log(newComment.id);
      res.status(201).json({ message: 'Added comment', comment: newComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding comment!' });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  if (req.method === 'GET') {
    try {
      await client.connect();
      const db = client.db();
      const commentsCollection = db.collection('comments');
      const result = await commentsCollection
        .find()
        .sort({ _id: -1 })
        .toArray();
      res
        .status(200)
        .json({ message: 'Success fetching comments!', comments: result });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error fetching comments!' });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}
export default handler;
