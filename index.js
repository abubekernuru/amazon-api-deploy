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
      amount: total, // amount in cents
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

app.listen(5000, () => console.log("✅ Server running on port 5000"));
