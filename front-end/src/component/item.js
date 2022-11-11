import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Item(props) {
    const { item, setError, updateCart } = props;
    const [product, setProduct] = useState([]);
    
  const increaseCart = async(item) => {
    try {
      let quantity = item.quantity + 1;
      await axios.put("/api/cart/" + item.id + "/" + quantity);
      updateCart();
    } catch(error) {
      setError("error decreasing" + error);
    }
  };
  
  const decreaseCart = async(item) => {
    try {
      let quantity = item.quantity - 1;
      await axios.put("/api/cart/" + item.id + "/" + quantity);
      updateCart();
    } catch(error) {
      setError("error decreasing" + error);
    }
  }; 
  
  const removeCart = async(item) => {
    try {
      await axios.delete("/api/cart/" + item.id);
      updateCart();
    } catch(error) {
      setError("error removing from cart" + error);
    }
  };
  
  useEffect(() => {
      
  const getName = async() => {
    try {
      console.log("output item: ",item);
      let output = await axios.get("/api/products/" + item.id);
      console.log("after axios");
      console.log("worked output: ", output.data);
      console.log("worked output name:", output.data.name);
      setProduct(output.data);
    } catch (error) {
      console.log("FAILED TO RUN");
      setError("error getName" + error);
    }
  };
  getName();
      
  }
  
      , [item, setError]);
      
  return (<div>
  {product.name}: {item.quantity} 
  <button onClick={e => decreaseCart(item)}> - </button>
  <button onClick={e => increaseCart(item)}> + </button>
  <button onClick={e => removeCart(item)}>Remove From Cart</button></div>)
}

