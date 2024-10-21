const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
      // res.header("Access-Control-Allow-Origin", "*");
      const allowedOrigins = ['http://localhost:3000', 'https://khushi-crafts.onrender.com'];
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
           res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-credentials", true);
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
      next();
    });

// MongoDB Atlas connection string (replace with your actual credentials)
const mongoUri = 'mongodb+srv://lucky81205:JKtQAuIL7auLnE4Z@cluster0.np6zm.mongodb.net/khushi-crafts-order?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  item: String,
  quantity: Number,
  price: String,
  customerName: String,
  customerEmail: String,
  customerMobile: Number
});

const Order = mongoose.model('Order', orderSchema);

// Route to handle order submission
app.post('/submit-order', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).send('Order Placed Successfully🎉');
  } catch (error) {
    res.status(400).send('Error storing order');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
