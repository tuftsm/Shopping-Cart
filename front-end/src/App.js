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
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [product, setProduct] = useState([]);
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
  
  const getName = async(item) => {
    try {
      console.log("output item: ",item);
      let output = await axios.get("/api/products/" + item.id);
      console.log("after axios");
      console.log("worked output: ", output.data);
      console.log("worked output name:", output.data.name);
      return output.data.name;
    } catch (error) {
      console.log("FAILED TO RUN");
      setError("error getName" + error);
    }
  }
  
  const idToName = async(item) => {
    let data = getName(item);
    console.log("DATA: ", data);
    console.log("DATA.NAME",data.name);
    return data.name;
  };
  
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
