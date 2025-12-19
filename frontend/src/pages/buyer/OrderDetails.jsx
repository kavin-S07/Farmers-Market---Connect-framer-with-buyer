import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      const response = await orderApi.getBuyerOrderById(id);
      setOrder(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      await orderApi.cancelOrder(id);
      fetchOrder();
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="container"><div className="error-message">{error}</div></div>;
  if (!order) return <div className="container"><p>Order not found</p></div>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-2">
        ← Back
      </button>

      <div className="card">
        <div className="flex-between mb-2">
          <h2>Order #{order.id}</h2>
          <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>

        <hr />

        <h3>Farmer Information</h3>
        <p><strong>Name:</strong> {order.farmerName}</p>

        <hr />

        <h3>Order Items</h3>
        <table style={{ width: '100%', marginTop: '10px' }}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.priceEach)}</td>
                <td>{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <h3>Total: {formatCurrency(order.totalAmount)}</h3>
        </div>

        {order.status === 'PENDING' && (
          <button onClick={handleCancel} className="btn btn-danger mt-2">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;