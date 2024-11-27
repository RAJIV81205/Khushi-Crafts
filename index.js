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
      const allowedOrigins = ['http://localhost:3000', 'https://khushi-crafts.onrender.com','https://khushi-crafts.vercel.app'];
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
  sendSmtpEmail.bcc = [{ email: 'aradhyadubey1113+orders@gmail.com' }];
  sendSmtpEmail.sender = { email: 'aradhyadubey1113@gmail.com', name: 'Khushi-Crafts' };
  sendSmtpEmail.subject = `Order Confirmation - #${orderNumber}`;

  // HTML content for the email
  sendSmtpEmail.htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Confirmation</title>
  <style type="text/css">
    /* General Styling */
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333333;
      margin: 0;
      padding: 0;
    }

    .u-content {
      padding: 20px;
      background-color: #ffffff;
      max-width: 600px;
      margin: auto;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color:#20dd49;
      font-size: 24px;
      margin-bottom: 20px;
    }

    p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    /* Table Styling */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      
    }

    th, td {
      text-align: left;
      padding: 12px;
      border: 1px solid #ddd;
      width:50%;
      text-align:center;
    }

    th {
      background-color: #f4f4f4;
      font-weight: bold;
    }

    td {
      background-color: #fafafa;
    }

    /* Buttons */
    a.button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #20dd49;
      color:black;
      text-decoration: none;
      border-radius: 10px;
      margin-right: 10px;
      box-shadow:0 3px 6px gray;
      border:1px solid black;
    }

    a.button:hover {
      border-radius:15px;
      background-color:black;
      color:#20dd49;
    }

    /* Responsive Design */
    @media only screen and (max-width: 480px) {
      .u-content {
        padding: 10px !important;
        font-size: 14px !important;
      }
      
      table{
        width: 100%;
        display: block;
      }

      th, td {
        text-align: center;
      }
    }
  </style>
</head>
<body>

  <div class="u-content">
  <div style="text-align: center;">
  <img src="https://i.postimg.cc/JhNxFfzy/image-1.png" alt="Cart Icon" width="120" height="100">
</div>
    <h2>Thank you for your order!🎉</h2>
    <p>Hi ${customerName},</p>
    <p>We are excited to inform you that your order <strong>#${orderNumber}</strong> has been successfully placed. Below are the details of your purchase:</p>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${item}</td>
          <td>${quantity}</td>
          <td>₹ ${price}</td>
        </tr>
        <!-- Add more items dynamically as needed -->
      </tbody>
    </table>

    <p><strong>Total Price:</strong>₹ ${price}</p>
    <p>If you have any questions, feel free to contact our support team at aradhyadubey1113@gmail.com.</p>

    <p>Thank you for choosing us!</p>
    
    <!-- Action Buttons -->
    <p>
      <a href="mailto:aradhyadubey1113@gmail.com" class="button">Contact Us</a>
      <a href="https://khushi-crafts.onrender.com" class="button">Order Again</a>
      <a href="https://getupilink.com/upi/lucky81205@okicici?am=${price}" class="button">Pay Now</a>
    </p>
  </div>

</body>
</html>
  `;

  // Send the email
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log('Email sent successfully: ' + JSON.stringify(data));
      res.status(200).send('Email Sent Successfully🎉');
    },
    function (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Email Sending Failed.');
    }
  );
});








app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
