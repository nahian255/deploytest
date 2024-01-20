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