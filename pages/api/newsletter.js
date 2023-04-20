import {
  BASE_API_HANDLERS_URI,
  createMongoClient,
  insertDocumentIntoCollection,
} from '../../helpers/db-utils';

const mongoClient = createMongoClient(BASE_API_HANDLERS_URI);

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid Email Address!' });
      return;
    }

    try {
      await insertDocumentIntoCollection(mongoClient, 'newsletter', {
        email: userEmail,
      });
      res.status(201).json({ message: 'Signed up!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error! Try to sign up again!' });
    } finally {
      // Ensures that the client will close when you finish/error
      await mongoClient.close();
    }
  }
}

export default handler;
