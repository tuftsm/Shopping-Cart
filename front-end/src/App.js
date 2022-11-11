import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);  
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch(error) {
      setError("error retrieving tickets: " + error);
    }
  }
  
  const fetchCart = async() => {
    try {      
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch(error) {
      setError("error retrieving cart: " + error);
    }
  }
  
  const createProduct = async() => {
    try {
      await axios.post("/api/products", {name: name, price: price});
    } catch(error) {
      setError("error adding a product: " + error);
    }
  }
  const addCart = async(product) => {
    try {
      await axios.post("/api/cart/" + product.id);
    } catch(error) {
      setError("error adding to cart" + error);
    }
  }
  
  const removeCart = async(item) => {
    try {
      await axios.delete("/api/cart/" + item.id);
    } catch(error) {
      setError("error removing from cart" + error);
    }
  }
  
  const increaseCart = async(item) => {
    try {
      let quantity = item.quantity + 1;
      await axios.put("/api/cart/" + item.id + "/" + quantity);
    } catch(error) {
      setError("error decreasing" + error);
    }
  }
  
  const decreaseCart = async(item) => {
    try {
      let quantity = item.quantity - 1;
      await axios.put("/api/cart/" + item.id + "/" + quantity);
    } catch(error) {
      setError("error decreasing" + error);
    }
  }  
  
  const getName = async(item) => {
    try {
      await axios.get("/api/cart/" + item.id);
    } catch (error) {
      setError("error decreasing" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchProducts();
  },[]);

  const addProduct = async(e) => {
    e.preventDefault();
    await createProduct();
    fetchProducts();
    setName("");
    setPrice("");
  }

  const addToCart = async(product) => {
    await addCart(product);
    fetchCart();
  }
  
  const removeFromCart = async(item) => {
    await removeCart(item);
    fetchCart();
  }
  
  const increase = async(item) => {
    await increaseCart(item);
    fetchCart();
  }

  const decrease = async(item) => {
    await decreaseCart(item);
    fetchCart();
  }  
  
  const idToName = async(item) => {
    const data = getName(item);
    return data.name;
  }



  // render results
  return (
    <div className="App">
      {error}
      <Row>
        <Col>
          <h1>Products</h1>
          {products.map( product => (
            <div key={product.id}>
              {product.name}, {product.price}
              <button onClick={e => addToCart(product)}>Add To Cart</button>
            </div>
          ))}   
        </Col>
        <Col>
          <h1>Cart</h1>
          {cart.map( item => (
            <div key={item.id}>
                {idToName(item)}, {item.id}, {item.quantity}
                <button onClick={e => decrease(item)}> - </button>
                <button onClick={e => increase(item)}> + </button>
                <button onClick={e => removeFromCart(item)}>Remove From Cart</button>          
            </div>
          ))}     
        </Col>      
      </Row>
    </div>
  );
}

export default App;
