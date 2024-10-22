const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()


const app = express();
app.use(express.static(path.join(__dirname)));
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
const mongoUri = process.env.MONGOURI;

// Connect to MongoDB Atlas
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  item: String,
  quantity: Number,
  price: String,
  customerName: String,
  customerEmail: String,
  customerMobile: Number,
  orderTime: String
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







const SibApiV3Sdk = require('sib-api-v3-sdk'); // Use SibApiV3Sdk, not Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization: api-key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY; // Replace with your Brevo API key



app.post('/send-order-confirmation', (req, res) => {
  const { orderNumber, item, quantity, price, customerName, customerEmail, customerMobile, orderTime } = req.body;

  // Create email payload
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: customerEmail }];
  sendSmtpEmail.sender = { email: 'aradhyadubey1113@gmail.com', name: 'Khushi-Crafts' };
  sendSmtpEmail.subject = `Order Confirmation - #${orderNumber}`;
  
  // HTML content for the email
  sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h1>Order Confirmation - #${orderNumber}</h1>
        <p>Thank you for your order, ${customerName}!</p>
        <h2>Order Details:</h2>
        <ul>
          <li>Item: ${item}</li>
          <li>Quantity: ${quantity}</li>
          <li>Total Price: ${price}</li>
        </ul>
        <p>Your order was placed. We will contact you soon on your mobile number: ${customerMobile}.</p>
        <p>Thank you for shopping with Khushi Crafts!</p>
      </body>
    </html>
  `;

  // Send the email
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function(data) {
      console.log('Email sent successfully: ' + JSON.stringify(data));
      res.status(200).send('Email Sent Successfully🎉');
    },
    function(error) {
      console.error('Error sending email:', error);
      res.status(500).send('Email Sending Failed.');
    }
  );
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
