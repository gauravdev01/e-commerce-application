import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetails';
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
      <h1> Products Store</h1>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
