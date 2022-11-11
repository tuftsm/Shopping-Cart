import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Cart} from './component/cart.js';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);  
  const [error, setError] = useState("");
  const [update, setUpdate] = useState(true);

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
  
  const addCart = async(product) => {
    try {
      await axios.post("/api/cart/" + product.id);
    } catch(error) {
      setError("error adding to cart" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchProducts();
  },[]);


  const addToCart = async(product) => {
    await addCart(product);
    fetchCart();
  }
  
  const updateCart = () => {
    setUpdate(true);
  }

  useEffect(() => {
    if(update) {
      fetchCart();
      setUpdate(false);
    }
    
  }, [update]);


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
              <Cart items = {cart} setError = {setError} updateCart = {updateCart}/>
        </Col>      
      </Row>
    </div>
  );
}

export default App;
