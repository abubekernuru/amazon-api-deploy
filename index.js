import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: true }));
app.use(express.json());

// Create a payment intent (test mode)
app.post("/payments/create", async (req, res) => {
  const total = req.query.total;
  console.log("💰 Payment Request Received for:", total);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, 
      currency: "usd",
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Stripe Error:", error);
    res.status(500).send({ error: error.message });
  }
});

// Add a root route for health checks
app.get("/", (req, res) => {
  res.json({ 
    message: "Amazon API Server is running!",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// Add health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Use Render's PORT environment variable and bind to 0.0.0.0
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});