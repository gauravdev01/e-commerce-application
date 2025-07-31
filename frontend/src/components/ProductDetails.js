import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not Found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !product) return <p>Product not found.</p>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p>💰 {product.price}</p>
      <p>📦 {product.description}</p>
      <Link to="/">⬅️ Back to Products</Link>
    </div>
  );
}

export default ProductDetail;
