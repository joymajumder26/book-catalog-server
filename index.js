require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://book-catalog:admin1234@cluster0.0qdtr89.mongodb.net/book-catalog?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db('book-catalog');
    const productCollection = db.collection('book');

    app.get('/books', async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post('/create-book', async (req, res) => {
      const book = req.body;

      const result = await productCollection.insertOne(book);
      console.log("---------------------",result);
      res.send(result);
    });

    app.get('/book/:id', async (req, res) => {
      console.log('req.params.id',req.params.id);

      const id = req.params.id;

      const result = await productCollection.findOne({ _id: ObjectId(id) });
      // console.log(result);
      res.send(result);
    });
    app.get('/books', (req, res) => {
      // Get search query parameters from request query string
      const { title, author, genre } = req.query;
    
      // Perform search logic based on the provided parameters
      // Replace this with your actual search implementation using your database or other data source
      const filteredBooks = books.filter(book => {
        let match = true;
    
        if (title && !book.title.toLowerCase().includes(title.toLowerCase())) {
          match = false;
        }
        if (author && !book.author.toLowerCase().includes(author.toLowerCase())) {
          match = false;
        }
        if (genre && !book.genre.toLowerCase().includes(genre.toLowerCase())) {
          match = false;
        }
    
        return match;
      });
    
      res.json(filteredBooks);
    });
    

    app.delete('/book/:id', async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      
      console.log('--------------------------------------',result);
      res.send(result);
    });

    app.put('/book/edit/:id',async (req, res) => {
      const id = req.params.id;
      const updatedBook = req.body; // Assuming you send the updated book data in the request body.
  
      const result = await productCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: updatedBook } // Use $set to update the fields of the book
      );
  
      if (result.modifiedCount !== 1) {
        console.log('Book not found or not updated');
        res.status(404).json({ error: 'Book not found or not updated' });
        return;
      }
  
      console.log('Book updated successfully');
      res.json({ message: 'Book updated successfully' });
    });

    app.post('/comment/:id', async (req, res) => {
      const productId = req.params.id;
      const comment = req.body.comment;

      console.log(productId);
      console.log(comment);

      const result = await productCollection.updateOne(
        { _id: ObjectId(productId) },
        { $push: { comments: comment } }
      );

      console.log(result);

      if (result.modifiedCount !== 1) {
        console.error('Book not found or comment not added');
        res.json({ error: 'Book not found or comment not added' });
        return;
      }

      console.log('Comment added successfully');
      res.json({ message: 'Comment added successfully' });
    });

    app.get('/comment/:id', async (req, res) => {
      const productId = req.params.id;

      const result = await productCollection.findOne(
        { _id: ObjectId(productId) },
        { projection: { _id: 0, comments: 1 } }
      );

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    });

    app.post('/user', async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);

      res.send(result);
    });

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;

      const result = await userCollection.findOne({ email });

      if (result?.email) {
        return res.send({ status: true, data: result });
      }

      res.send({ status: false });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
