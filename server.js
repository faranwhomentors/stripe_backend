const express = require("express");
const app = express();
const { resolve } = require("path");
// This is your real test secret API key.
const stripe = require("stripe")(process.env.secret_key);

app.use(express.static("."));
app.use(express.json());

// An endpoint for your checkout 
app.post("/checkout", async (req, res) => {
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
  
  // Create a PaymentIntent with the order amount, currency, and customer
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100,
    currency: "usd",
    customer: customer.id
  });
  
  // Create a 
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
  
  // Create a PaymentIntent with the order amount and currency
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