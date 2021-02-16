// This example uses the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
const express = require("express");
const app = express();
const { resolve } = require("path");
const stripe = require("stripe")(process.env.secret_key); // https://stripe.com/docs/keys#obtain-api-keys

app.use(express.static("."));
app.use(express.json());

app.post("/payment-sheet", async (req, res) => {
  // Here, we're creating a new Customer. Use an existing Customer if this is a returning user.
  const customer = await stripe.customers.create();
  
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: "usd",
    customer: customer.id
  });
  
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id
  });
});

app.listen(process.env.PORT, () =>
  console.log(`Node server listening on port ${process.env.PORT}!`)
);
