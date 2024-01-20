const express = require('express')
const app = express()
const port = process.env.PORT || 2000
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://newUsernn:oxt6paPPml6565ll@cluster0.skhrrsn.mongodb.net/?retryWrites=true&w=majority";

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

        app.get('/user', async (req, res) => {
            try {
                const info = await newCollection.find().toArray()
                res.send(info)
            } catch (error) {
                console.log(error);
            }
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Bismillah-want to devloy.')
})

app.listen(port, () => {
    console.log(`The server is running - ${port}`)
})