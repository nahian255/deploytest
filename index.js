const express = require('express')
const app = express()
const port = process.env.PORT || 2000;
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.user}:${process.env.pass}@cluster0.skhrrsn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const newCollection = client.db('academy').collection('super')
        const latesCollection = client.db('academy').collection('latest')
        const properitesCollection = client.db('dreamDwell').collection('properitesInfo');
        const messageCollection = client.db('dreamDwell').collection('messageCollection');


        app.get('/user', async (req, res) => {
            try {
                const info = await newCollection.find().toArray()
                res.send(info)
            } catch (error) {
                console.log(error);
            }
        })

        app.get('/latest', async (req, res) => {
            try {
                const newinfo = await latesCollection.find().toArray()
                res.send(newinfo)
            } catch (error) {
                console.log(error);
            }
        })

        // get all property here
        app.get('/properites', async (req, res) => {
            try {
                const items = await properitesCollection.find().toArray();
                res.send(items);
            } catch (error) {
                console.error('Error getting items:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add a property in database.
        app.post('/api/add-properties', async (req, res) => {
            try {
                const { name, email, details, image, location, price, bathrooms, rooms } = req.body;
                // Create a document to be inserted
                const propertyDocument = { name, email, details, image, location, price, bathrooms, rooms };

                // Insert a single document
                const result = await properitesCollection.insertOne(propertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // add message in database.
        app.post('/api/add-message', async (req, res) => {
            try {
                const { name, email, message } = req.body;
                // Create a document to be inserted
                const propertyDocument = {
                    name,
                    email,
                    message,
                };
                // console.log(propertyDocument);
                // Insert a single document
                const result = await messageCollection.insertOne(propertyDocument);
                console.log('Inserted property ID:', result.insertedId);
                res.status(201).json({ message: 'Property added successfully' });
            } catch (error) {
                console.error('Error adding property:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // get my-property whith email..
        app.get('/api/myadded-properites', async (req, res) => {
            try {
                const userEmail = req.query.email;

                // console.log(userEmail);
                if (!userEmail) {
                    // If email is not provided in query parameters, return a bad request response
                    return res.status(400).json({ error: 'Email parameter is missing' });
                }

                // Query the bookingProperty collection for data with the specified email
                const bookings = await properitesCollection.find({ email: userEmail }).toArray();
                res.status(200).json(bookings);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // get single property detials...
        app.get('/single-properites/:id', async (req, res) => {
            try {
                const itemId = req.params.id;
                // Check if itemId is a valid ObjectId
                if (!ObjectId.isValid(itemId)) {
                    return res.status(400).json({ error: 'Invalid ObjectID' });
                }
                const item = await properitesCollection.findOne({ _id: new ObjectId(itemId) });
                if (item) {
                    res.json(item);
                } else {
                    res.status(404).json({ error: 'Item not found' });
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/another', (req, res) => {
    res.send('new checking')
})
app.get('/', (req, res) => {
    res.send('Bismillah-want to devloy.')
})

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});