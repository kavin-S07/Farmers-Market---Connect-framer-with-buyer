// src/pages/buyer/BuyerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/helpers';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await orderApi.getBuyerStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="buyer-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Buyer Dashboard</h1>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats?.totalOrders || 0}</h3>
              <p>TOTAL ORDERS</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats?.pendingOrders || 0}</h3>
              <p>PENDING ORDERS</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats?.completedOrders || 0}</h3>
              <p>COMPLETED ORDERS</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatCurrency(stats?.totalSpent || 0)}</h3>
              <p>TOTAL SPENT</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/buyer/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>View My Orders</h3>
              <p>Track and manage your orders</p>
            </Link>

            <Link to="/products" className="action-card">
              <div className="action-icon">🛒</div>
              <h3>Browse Products</h3>
              <p>Find fresh produce from local farmers</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;