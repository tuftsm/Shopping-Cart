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
let cart = []
let id = 0;

app.get('/api/cart', (req, res) => {
  console.log("In get cart");
  res.send(cart);
});

app.post('/api/cart/:id', (req, res) => {
  console.log("In post cart");
  let id = parseInt(req.params.id);
  const foundItem = cart.find(item => item.id == id);
  if (foundItem) {
    foundItem.quantity += 1;
    res.send(foundItem);
  }
  else {
      let item = {
      id: id,
      quantity: 1
    };      
    cart.push(item);
    res.send(item);
  }
});



app.put('/api/cart/:id/:quantity', (req, res) => {
  console.log("In put");
  let id = parseInt(req.params.id);
  const foundItem = cart.find(item => item.id == id);   
  if (foundItem) {
      let quantity = parseInt(req.params.quantity);
      if (quantity == 0) {
        let removeIndex = cart.map(deleteItem => {
            return deleteItem.id;
        })
        .indexOf(id);
        cart.splice(removeIndex, 1);
        res.sendStatus(200);
        return;
      }
      else {
          foundItem.quantity = quantity;
          res.send(foundItem);
      }
  }
  else {
    res.status(404)
      .send("Sorry, that product is not in the cart");
    return;
  }
});

app.delete('/api/cart/:id', (req, res) => {
  console.log("In delete cart");
  let id = parseInt(req.params.id);
  let removeIndex = cart.map(item => {
      return item.id;
    })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(404)
      .send("Sorry, that product doesn't exist");
    return;
  }
  cart.splice(removeIndex, 1);
  res.sendStatus(200);
});




app.get('/api/products', (req, res) => {
  console.log("In get products");
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
  console.log("In post products");
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
  console.log("In delete products");
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