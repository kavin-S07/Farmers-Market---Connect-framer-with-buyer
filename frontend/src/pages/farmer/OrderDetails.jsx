import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../utils/constants';
import './OrderDetails.css'; // Import CSS file

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // ✅ FIXED: Use getFarmerOrderById instead of getOrderById
      const response = await orderApi.getFarmerOrderById(id);
      setOrder(response.data);

    } catch (err) {
      console.error('Error fetching order:', err);

      let errorMessage = 'Failed to load order details';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Order not found';
        } else if (err.response.status === 403) {
          errorMessage = 'You do not have permission to view this order';
        } else if (err.response.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleConfirm = async () => {
    if (!window.confirm('Are you sure you want to confirm this order?')) return;
    try {
      await orderApi.confirmOrder(id);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm order');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;
    try {
      await orderApi.rejectOrder(id);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject order');
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Are you sure you want to complete this order?')) return;
    try {
      await orderApi.completeOrder(id);
      await fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete order');
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container order-details-page">
        <button onClick={() => navigate('/farmer/orders')} className="btn btn-secondary mb-2">
          ← Back to Orders
        </button>
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container order-details-page">
        <button onClick={() => navigate('/farmer/orders')} className="btn btn-secondary mb-2">
          ← Back to Orders
        </button>
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="container order-details-page">
      <button onClick={() => navigate('/farmer/orders')} className="btn btn-secondary mb-2">
        ← Back to Orders
      </button>

      <div className="order-details-container">
        <div className="order-details-header">
          <h1>Order #{order.id}</h1>
          <span className={`badge badge-${ORDER_STATUS_COLORS[order.status]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="order-details-meta">
          <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
        </div>

        <hr />

        <div className="order-details-section">
          <h3>Buyer Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Name:</strong> {order.buyerName || "Not Provided"}
            </div>
            <div className="info-item">
              <strong>Phone:</strong> {order.buyerPhone || "Not Provided"}
            </div>
            <div className="info-item">
              <strong>State:</strong> {order.buyerState || "Not Provided"}
            </div>
            <div className="info-item">
              <strong>District:</strong> {order.buyerDistrict || "Not Provided"}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {order.buyerEmail || "Not Provided"}
            </div>
            <div className="info-item">
              <strong>Address:</strong> {order.buyerAddress || "Not Provided"}
            </div>
          </div>
        </div>

        <hr />

        <div className="order-details-section">
          <h3>Order Items</h3>
          <div className="order-items-table">
            <div className="table-header">
              <div className="table-col">Product</div>
              <div className="table-col">Quantity</div>
              <div className="table-col">Price</div>
              <div className="table-col">Subtotal</div>
            </div>
            {order.items?.map(item => (
              <div className="table-row" key={item.id}>
                <div className="table-col">{item.productName}</div>
                <div className="table-col">{item.quantity} {item.unit}</div>
                <div className="table-col">{formatCurrency(item.priceEach)}</div>
                <div className="table-col">{formatCurrency(item.subtotal)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-total-section">
          <div className="order-total">
            <strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}
          </div>
        </div>

        {order.status === 'PENDING' && (
          <div className="order-actions">
            <button onClick={handleConfirm} className="btn btn-success btn-lg">
              ✓ Confirm Order
            </button>
            <button onClick={handleReject} className="btn btn-danger btn-lg">
              ✗ Reject Order
            </button>
          </div>
        )}

        {order.status === 'CONFIRMED' && (
          <div className="order-actions">
            <button onClick={handleComplete} className="btn btn-primary btn-lg">
              ✓ Mark as Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;