const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000;
require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kd6g5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJhonShop").collection("products");
  const orders = client.db("emaJhonShop").collection("orders");


  app.post('/addProduct', (req, res) => {
    const product = req.body;
    products.insertOne(product)
    .then(result => {
      console.log(result);
      console.log(result.insertedCount)
      res.send(result.insertedCount)
    })
  })
  app.get('/products', (req, res) => {
    products.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })
  

  app.get('/product/:key', (req, res) => {
    products.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    products.find({key: {$in: productKeys}})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orders.insertOne(order)
    .then(result => {
      res.send(result.insertedCount> 0)
    })
  })

});
app.get('/', function (req, res) {
  res.send('hello world')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})