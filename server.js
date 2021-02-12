// This example uses the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
const express = require("express");
const app = express();
const { resolve } = require("path");
const stripe = require("stripe")(process.env.secret_key); // https://stripe.com/docs/keys#obtain-api-keys

app.use(express.static("."));
app.use(express.json());

// An endpoint for your checkout 
app.post("/checkout", async (req, res) => { 
  // Create or retrieve the Stripe Customer object associated with your user.
  let customer = await stripe.customers.create(); // This example just creates a new Customer every time
  
  // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'}
  );  
    
  // Create a PaymentIntent with the payment amount, currency, and customer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 973,
    currency: "usd",
    customer: customer.id
  });
  
  // Send the object keys to the client
  res.send({
    publishableKey: process.env.publishable_key, // https://stripe.com/docs/keys#obtain-api-keys
    paymentIntent: paymentIntent.client_secret,
    customer: customer.id,
    ephemeralKey: ephemeralKey.secret
  });
});

app.post('/payment-sheet', async (req, res) => {
  // Here, we're creating a new Customer. Use an existing Customer if this is a returning user.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {stripe_version: '2020-08-27'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    customer: customer.id,
  });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id
  });
});

app.listen(3000, () => console.log('Node server listening on port 4242!'));