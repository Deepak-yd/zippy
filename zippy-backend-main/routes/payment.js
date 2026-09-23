const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_T4Zw9v5VFk4BbP';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'Hi0pRW0yRzCHPGpt4S6tknhe';

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// API 1: Naya Order Create Karna
router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Razorpay paise me kaam karta hai (₹1 = 100 paise)
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };
    
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: "Payment initialization failed", error });
  }
});

// API 2: Payment Verify Karna
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Security check - Signature verify karna
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)
                               .update(sign.toString())
                               .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;