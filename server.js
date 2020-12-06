const express = require("express");
const app = express();
const { resolve } = require("path");
const stripe = require("stripe")(process.env.secret_key);

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
      customer = await stripe.customers.retrieve(
        'cus_GWUuPERgJF44Dm'  // A hardcoded customer ID
      );
  }
  
  // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'}
  );  
  
    
  // Create a PaymentIntent with the payment amount, currency, and customer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: "usd",
    customer: customer.id
  });
  
  // Send the object keys to the client
  res.send({
    paymentIntentClientSecret: paymentIntent.client_secret,
    customerId: customer.id,
    customerEphemeralKeySecret: ephemeralKey.secret
  });
});

// An endpoint for the test playground
app.post("/checkout_playground", async (req, res) => {

  let customer_type = req.body.customer
  console.log(req.body)
  let customer
  if (customer_type == "new") {
      customer = await stripe.customers.create();
  } else if (customer_type == "saved") {
      customer = await stripe.customers.retrieve(
        'cus_GWUuPERgJF44Dm'
      );
  }
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: "usd",
    customer: customer.id
  });
  
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'}
  );  
  
  res.send({
    clientSecret: paymentIntent.client_secret,
    customerID: customer.id,
    ephemeralKey: ephemeralKey.secret
  });
});


app.listen(3000, () => console.log('Node server listening on port 4242!'));