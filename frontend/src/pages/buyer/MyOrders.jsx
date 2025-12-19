import React, { useState, useEffect, useCallback } from 'react';
import { orderApi } from '../../api/orderApi';
import OrderCard from '../../components/order/OrderCard';
import Loading from '../../components/common/Loading';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderApi.getBuyerOrders(filter);
      setOrders(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h1>My Orders</h1>

      <div className="filter-buttons" style={{ marginBottom: '20px' }}>
        <button
          className={`btn ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('')}
        >
          All
        </button>
        <button
          className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('PENDING')}
        >
          Pending
        </button>
        <button
          className={`btn ${filter === 'CONFIRMED' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('CONFIRMED')}
        >
          Confirmed
        </button>
        <button
          className={`btn ${filter === 'COMPLETED' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('COMPLETED')}
        >
          Completed
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {orders.length === 0 ? (
        <div className="card text-center">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="grid grid-2">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} userRole="BUYER" onUpdate={fetchOrders} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;