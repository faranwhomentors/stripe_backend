const express = require("express");
const app = express();
const { resolve } = require("path");
const stripe = require("stripe")(process.env.secret_key); // https://stripe.com/docs/keys#obtain-api-keys

app.use(express.static("."));
app.use(express.json());

// An endpoint for your checkout 
app.post("/checkout", async (req, res) => {
  let customer_type = req.body.customer
  console.log(req.body)
  
  // Create or retrieve the Stripe Customer object associated with your user
  let customer
  if (customer_type == "new" || customer_type == null) {
      customer = await stripe.customers.create();
  } else if (customer_type == "returning") {
      // Retrieve an existing Customer to let them use their previously saved payment methods
      customer = await stripe.customers.retrieve(
        process.env.saved_customer_id
      );
  }
  
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
    paymentIntentClientSecret: paymentIntent.client_secret,
    customerId: customer.id,
    customerEphemeralKeySecret: ephemeralKey.secret
  });
});

app.listen(3000, () => console.log('Node server listening on port 4242!'));