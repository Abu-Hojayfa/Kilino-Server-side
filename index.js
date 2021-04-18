const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const db = process.env.DB_DATABASE;
const servicesCollection = process.env.DB_COLLECTIONSERVICES;
const reviewsCollection = process.env.DB_COLLECTIONREVIEWS;
const infoCollection = process.env.DB_COLLECTIONPAYINFO;
const admin = process.env.DB_COLLECTIONADMIN;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${user}:${pass}@cluster0.pec8g.mongodb.net/${db}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());

client.connect((err) => {
  const services = client.db(`${db}`).collection(`${servicesCollection}`);
  const reviews = client.db(`${db}`).collection(`${reviewsCollection}`);
  const paymentInfo = client.db(`${db}`).collection(`${infoCollection}`);
  const adminInfo = client.db(`${db}`).collection(`${admin}`);

  // services
  app.get("/services", (req, res) => {
    services.find({})
      .toArray((err, doc) => {
        res.send(doc);
      });
  });

  app.post("/addnewservice", (req, res) => {
    const data = req.body;
    services.insertOne(data)
      .then( doc => {
        res.send(doc);
      });
  });
  
  app.post("/service", (req, res) => {
    const id = req.body.id;
    services.find({ _id: ObjectId(id) })
      .toArray((err, doc) => {
        res.send(doc);
      });
  });
  
  // delete service
  app.delete("/deleteservice", (req,res)=>{
    const id = req.body.id;
    services.deleteOne({_id: ObjectId(id)})
      .then( doc => res.send(doc));
  });

  // all services
  app.get("/allservices", (req, res)=>{
    paymentInfo.find()
    .toArray((err, doc)=>{
      res.send(doc);
    });
  });

  // update status
  app.post("/updatestatus", (req, res) => {
    const id = req.body.id;
    const status = req.body.status;
    console.log(id, status);
});

  // specific user data 
  app.post("/userservices", (req, res)=>{
    paymentInfo.find({ email: req.body.email})
    .toArray((err, doc) =>{
      res.send(doc);
    })
  });

  // add a new review
  app.post('/addanewreview' ,(req, res)=>{
    reviews.insertOne(req.body)
    .then((data) => res.send (data));
  });

  // payments
  app.post("/paymentinfo", (req, res) => {
    const data = req.body;
    paymentInfo.insertOne(data)
      .then((doc) => {
        res.send(doc);
      });
  });

  // check Admin and add another admin
  app.post("/isadmin", (req, res)=>{
    const email = req.body.email;
    adminInfo.find({email: email })
    .toArray((err, doc)=>{
      res.send(doc);
    });
  });
  
  app.post("/makeanadmin", (req, res)=>{
    const email = req.body;
    adminInfo.insertOne(email)
    .then( doc => {
      res.send(doc);
    });
  });

  // reviews
  app.get("/reviews", (req, res) => {
    reviews.find({}).toArray((err, doc) => {
      res.send(doc);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
