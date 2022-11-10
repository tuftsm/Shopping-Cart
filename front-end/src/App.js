import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

  // render results
  return (
    <div className="App">
      {error}
      <h1>Cart</h1>
      {cart.map( item => (
        <div key={item.id}>
            {item.id}, {item.quantity}
        </div>
      ))}         
      <h1>Products</h1>
      {products.map( product => (
        <div key={product.id} className="product">
            {product.name}, {product.price}
          <button onClick={e => addToCart(product)}>Add To Cart</button>
        </div>
      ))}     
    </div>
  );
}

export default App;
