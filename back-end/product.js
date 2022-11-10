const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('public'));

let products = [];
let cart = [];
let id = 0;

app.get('/api/cart', (req, res) => {
  console.log("In get cart");
  res.send(cart);
});

app.get('/api/products', (req, res) => {
  console.log("In get");
  res.send(products);
});

app.get('/api/products/:id', (req, res) => {
  console.log("In getID");
  let id = parseInt(req.params.id);
  let target = products.map(product => {
      return product.id;
    })
    .indexOf(id);
  if (target === -1) {
    res.status(404)
      .send("Sorry, that product doesn't exist");
    return;
  }
  res.send(products[target]);
  res.sendStatus(200);
})

app.post('/api/products', (req, res) => {
  console.log("In post");
  id = id + 1;
  let product = {
    id: id,
    name: req.body.name,
    price: req.body.price
  };
  products.push(product);
  res.send(product);
});


app.delete('/api/products/:id', (req, res) => {
  console.log("In delete");
  let id = parseInt(req.params.id);
  let removeIndex = products.map(product => {
      return product.id;
    })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(404)
      .send("Sorry, that product doesn't exist");
    return;
  }
  products.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));