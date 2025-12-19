// src/pages/farmer/MyProducts.jsx - FIXED DELETE FUNCTIONALITY
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import ProductCard from '../../components/product/ProductCard';
import Loading from '../../components/common/Loading';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getMyProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    navigate(`/farmer/products/edit/${product.id}`);
  };

  // ✅ FIXED: Properly implemented delete function
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await productApi.deleteProduct(id);
      alert('Product deleted successfully!');
      // Refresh the product list after deletion
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      alert(errorMessage);
    }
  };

  // ✅ REMOVED: toggleProductStatus function (not implemented in backend)
  // If you want to add active/inactive toggle later, you need to add it to the backend first

  if (loading) return <Loading />;

  return (
    <div className="container">
      <div className="flex-between mb-2">
        <h1>My Products</h1>
        <Link to="/farmer/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {products.length === 0 ? (
        <div className="card text-center">
          <p>You haven't added any products yet.</p>
          <Link to="/farmer/products/add" className="btn btn-primary mt-2">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              // ✅ REMOVED onToggle prop since backend doesn't support it
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;