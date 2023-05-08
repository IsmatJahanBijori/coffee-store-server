// 4EnTkPjfX7AJhGZi
// ismat_jahan_coffee
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.json())

// console.log(process.env.DB_USER)
const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-euh9qdo-shard-00-00.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-01.hbyxuz9.mongodb.net:27017,ac-euh9qdo-shard-00-02.hbyxuz9.mongodb.net:27017/?ssl=true&replicaSet=atlas-ny4qda-shard-0&authSource=admin&retryWrites=true&w=majority`;

MongoClient.connect(uri, function(err, client) {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

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




    // data collection create
    const coffeeCollection=client.db("coffeeDB").collection("coffeeTable");
    // post method data create //data send to mongodb
    app.post('/coffee', async(req, res)=>{
        const newCoffee=req.body; //form er maddhome ja pathaise seta eitar maddhome asbe
        console.log(newCoffee) //eta console e asbe
        const result=await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })


    // delete method data delete
    app.delete('/coffee/:id', async(req, res)=>{
        const id=req.params.id;
        // console.log(id)
        const query={_id: new ObjectId(id)}
        const result=await coffeeCollection.deleteOne(query)
        res.send(result)
    })



    // get method data read
    // eita use korle server side er browser e data show korbe 
    app.get('/coffee', async(req, res)=>{
        // const query=coffeeCollection.find()
        const result=await coffeeCollection.find().toArray()
        res.send(result)
    })


    // update korar jonne get method diye ekta id dhorte hobe
    app.get('/coffee/:id', async(req, res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        // const options = { upsert: true };
        const result=await coffeeCollection.findOne(query)
        res.send(result)
    })

    app.put('/coffee/:id', async(req, res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateCoffee=req.body;
        const coffee = {
            $set: {
              name:updateCoffee.name,
              quantity: updateCoffee.quantity,
              photo: updateCoffee.photo,
              supplier: updateCoffee.supplier,
              taste:updateCoffee.taste,
              category: updateCoffee.category,
              details: updateCoffee.details,
            },
          };
          const result=await coffeeCollection.updateOne(query, coffee, options)
          res.send(result)

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
  res.send('My Coffee Store is Running')
})

app.listen(port, () => {
  console.log(`My Coffee Store is Running on port ${port}`)
})