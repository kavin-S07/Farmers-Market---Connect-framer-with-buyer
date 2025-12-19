// src/components/product/ProductCard.jsx - FIXED VERSION
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product, showActions, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      )}

      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-details">
          <div className="product-price">
            <strong>{formatCurrency(product.price)}</strong> / {product.unit}
          </div>
          <div className="product-stock">
            Available: {product.qtyAvailable} {product.unit}
          </div>
        </div>

        {product.farmerName && (
          <div className="product-farmer">
            <p><strong>Farmer:</strong> {product.farmerName}</p>
            <p><small>{product.farmerDistrict}, {product.farmerState}</small></p>
          </div>
        )}

        {!product.active && (
          <div className="badge badge-danger">Inactive</div>
        )}

        <div className="product-actions">
          {showActions ? (
            <>
              <button
                onClick={() => onEdit(product)}
                className="btn btn-primary btn-sm"
              >
                Edit
              </button>
              {/* ✅ REMOVED Toggle Button - Not supported by backend */}
              <button
                onClick={() => onDelete(product.id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </>
          ) : (
            <Link to={`/products/${product.id}`} className="btn btn-primary">
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;