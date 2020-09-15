// Stripe
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);

const express = require("express");
const app = express();
app.get('/', (req, res) => {
  res.send('f');
});

app.post("/checkout", function(request, response) {
  return response.send("hi");
  try {
    let customer = stripe.customers.create({
       description: "Sample"
    });
    console.log(customer)

    response.send({
      "customer_id": customer
    })
  }
  catch (err) {
    console.log(err);
  }
  // const {name, message} = request.query
  // response.send({name, message})
});

const listener = app.listen(process.env.PORT, function() {
    console.log("Your app is listening on port " + listener.address().port);
});

