// src/pages/buyer/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { orderApi } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/helpers';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.getProductById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      alert('Please login to place an order');
      navigate('/login');
      return;
    }

    if (!isBuyer) {
      alert('Only buyers can place orders');
      return;
    }

    if (quantity > product.qtyAvailable) {
      alert(`Maximum available quantity is ${product.qtyAvailable} ${product.unit}`);
      return;
    }

    setOrdering(true);
    try {
      const orderData = {
        farmerId: product.farmerId,
        items: [
          {
            productId: product.id,
            quantity: parseFloat(quantity)
          }
        ]
      };

      await orderApi.createOrder(orderData);
      alert('Order placed successfully!');
      navigate('/buyer/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="container"><div className="error-message">{error}</div></div>;
  if (!product) return <div className="container"><p>Product not found</p></div>;

  return (
    <div className="container product-detail-page">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-2">
        ← Back
      </button>

      <div className="product-detail-container">
        <div className="product-detail-info-section">
          <h1>{product.name}</h1>

          {!product.active && (
            <span className="badge badge-danger mb-2">Unavailable</span>
          )}

          <div className="product-detail-price">
            {formatCurrency(product.price)} <span className="unit">/ {product.unit}</span>
          </div>

          <div className="product-detail-stock">
            <strong>In Stock:</strong> {product.qtyAvailable} {product.unit}
          </div>

          <div className="product-detail-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available'}</p>
          </div>

          <div className="product-detail-farmer">
            <h3>Farmer Information</h3>
            <p><strong>Name:</strong> {product.farmerName}</p>
            <p><strong>Location:</strong> {product.farmerDistrict}, {product.farmerState}</p>
            {product.farmerPhone && (
              <p><strong>Phone:</strong> {product.farmerPhone}</p>
            )}
          </div>

          {product.active && product.qtyAvailable > 0 && (
            <div className="product-detail-order">
              <div className="quantity-selector">
                <label>Quantity ({product.unit})</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  max={product.qtyAvailable}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="order-total">
                <strong>Total:</strong> {formatCurrency(product.price * quantity)}
              </div>

              <button
                onClick={handleOrderNow}
                disabled={ordering || !product.active || quantity <= 0}
                className="btn btn-primary btn-lg"
              >
                {ordering ? 'Placing Order...' : 'Order Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;