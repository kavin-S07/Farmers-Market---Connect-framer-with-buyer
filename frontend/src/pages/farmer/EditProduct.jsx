import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import ProductForm from '../../components/product/ProductForm';
import Loading from '../../components/common/Loading';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await productApi.getFarmerProduct(id);
      setProduct(response.data);
    } catch (err) {
      alert('Failed to load product');
      navigate('/farmer/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await productApi.updateProduct(id, formData);
      alert('Product updated successfully!');
      navigate('/farmer/products');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container">
      <h1>Edit Product</h1>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/farmer/products')}
        loading={submitting}
      />
    </div>
  );
};

export default EditProduct;