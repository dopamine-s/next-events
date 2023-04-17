import { MongoClient, ServerApiVersion } from 'mongodb';

async function handler(req, res) {
  const uri =
    'mongodb+srv://Dopamine-s:Ro75ZTssxvZGW1P2@cluster0.e7nhbaz.mongodb.net/?retryWrites=true&w=majority';

  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid Email Address!' });
      return;
    }

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    try {
      await client.connect();
      const db = client.db();
      const emailsCollection = db.collection('emails');
      await emailsCollection.insertOne({ email: userEmail });
      res.status(201).json({ message: 'Signed up!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error! Try to sign up again!' });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}

export default handler;
