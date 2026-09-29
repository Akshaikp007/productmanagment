import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import ProductForm from '../components/ProductForm';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import api from '../api/axios';

const QUICK_CATEGORIES = [
  'All',
  'Electronics',
  'Computers & Accessories',
  'Furniture & Decor',
  'Clothing & Apparel'
];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products from backend with optional search
  const fetchProducts = useCallback(async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const url = search ? `/products?search=${encodeURIComponent(search)}` : '/products';
      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Unable to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Derived metrics for executive stats banner
  const totalValuation = useMemo(() => {
    return products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
  }, [products]);

  const categoryCount = useMemo(() => {
    const cats = new Set(products.map((p) => p.category?.trim()).filter(Boolean));
    return cats.size;
  }, [products]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim());
    fetchProducts(searchQuery.trim());
  };

  // Handle quick category filter click
  const handleQuickFilter = (category) => {
    if (category === 'All') {
      handleClearSearch();
    } else {
      setSearchQuery(category);
      setActiveSearch(category);
      fetchProducts(category);
    }
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
    fetchProducts('');
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  // Handle Create or Edit submission
  const handleFormSubmit = async (productData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        // Edit product
        const res = await api.put(`/products/${editingProduct._id}`, productData);
        setProducts((prev) =>
          prev.map((item) => (item._id === editingProduct._id ? res.data : item))
        );
        showSuccess('Product updated successfully!');
      } else {
        // Create product
        const res = await api.post('/products', productData);
        setProducts((prev) => [res.data, ...prev]);
        showSuccess('Product added successfully!');
      }
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Form submission error:', err);
      alert(err.response?.data?.message || 'Error saving product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Confirm product deletion
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await api.delete(`/products/${deletingProduct._id}`);
      setProducts((prev) => prev.filter((item) => item._id !== deletingProduct._id));
      showSuccess(`"${deletingProduct.name}" deleted successfully.`);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // Category badge color mapper for distinct visual aesthetics
  const getCategoryClass = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('elect')) return 'badge-cyan';
    if (cat.includes('comp') || cat.includes('tech')) return 'badge-indigo';
    if (cat.includes('furn') || cat.includes('decor')) return 'badge-amber';
    if (cat.includes('cloth') || cat.includes('apparel')) return 'badge-purple';
    if (cat.includes('book')) return 'badge-emerald';
    return 'badge-neutral';
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-content">
        <div className="container">
          {/* Header Title & Action */}
          <div className="dashboard-hero">
            <div>
              <h2 className="page-title">Product Management</h2>
              <p className="page-subtitle">
                Centralized catalog control, real-time inventory metrics, and cloud CRUD pipeline.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="btn btn-primary btn-glow"
              id="add-product-btn"
            >
              <svg
                className="btn-svg-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Product
            </button>
          </div>

          {/* Metric Summary Cards */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">ACTIVE INVENTORY</span>
                <span className="metric-icon-box cyan-glow">📦</span>
              </div>
              <div className="metric-value">{products.length}</div>
              <div className="metric-footer">
                <span className="metric-indicator positive">● Real-time</span>
                <span className="metric-detail">verified SKUs</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">CATALOG VALUATION</span>
                <span className="metric-icon-box emerald-glow">💎</span>
              </div>
              <div className="metric-value font-mono">{formatPrice(totalValuation)}</div>
              <div className="metric-footer">
                <span className="metric-indicator positive">↑ Live Calc</span>
                <span className="metric-detail">accumulated value</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-label">DISTINCT CATEGORIES</span>
                <span className="metric-icon-box violet-glow">🏷️</span>
              </div>
              <div className="metric-value">{categoryCount}</div>
              <div className="metric-footer">
                <span className="metric-indicator neutral">● Segments</span>
                <span className="metric-detail">in database</span>
              </div>
            </div>
          </div>

          {/* Top Actions: Search and Quick Filter Chips */}
          <div className="toolbar-section">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper">
                <svg
                  className="search-svg-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  className="form-input search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  id="search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={handleClearSearch}
                    title="Clear search"
                  >
                    &times;
                  </button>
                )}
              </div>
              <button type="submit" className="btn btn-secondary" id="search-btn">
                Search
              </button>
            </form>

            {/* Quick Category Filter Pills */}
            <div className="quick-category-pills">
              {QUICK_CATEGORIES.map((cat) => {
                const isSelected =
                  (cat === 'All' && !activeSearch) || activeSearch.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleQuickFilter(cat)}
                    className={`category-pill-btn ${isSelected ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Search Filter Banner */}
          {activeSearch && (
            <div className="active-filter-bar">
              <div className="filter-tag">
                <span className="filter-dot"></span>
                <span>
                  Filter query: <strong>&quot;{activeSearch}&quot;</strong>
                </span>
              </div>
              <button onClick={handleClearSearch} className="btn-text filter-clear-btn">
                Clear filter &times;
              </button>
            </div>
          )}

          {/* Success Notification Alert */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              <div className="alert-content">
                <span className="alert-icon">✓</span>
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                className="alert-close"
                onClick={() => setSuccessMessage('')}
              >
                &times;
              </button>
            </div>
          )}

          {/* Error State Banner */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <div className="alert-content">
                <span className="alert-icon">✕</span>
                <span>{error}</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => fetchProducts(activeSearch)}
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="state-container card-surface">
              <div className="spinner-lumina">
                <div className="spinner-inner"></div>
              </div>
              <p className="state-text font-mono">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="state-container empty-state card-surface">
              <div className="empty-icon-shield">
                <span className="empty-icon-symbol">📦</span>
              </div>
              <h3 className="empty-title">No products found.</h3>
              <p className="empty-description">
                {activeSearch
                  ? `No matching records found for "${activeSearch}". Try searching by another keyword or reset the filter.`
                  : 'Your inventory catalog is currently empty. Create your first product to begin.'}
              </p>
              {activeSearch ? (
                <button onClick={handleClearSearch} className="btn btn-secondary">
                  View All Products
                </button>
              ) : (
                <button onClick={handleOpenCreate} className="btn btn-primary btn-glow">
                  + Add Product
                </button>
              )}
            </div>
          ) : (
            /* Products Table Card */
            <div className="table-card-container card-surface">
              <div className="table-responsive">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Created Date</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="product-row">
                        <td className="product-name-cell">
                          <div className="product-title-wrapper">
                            <span className="product-bullet"></span>
                            <span className="product-title-text">{product.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`category-badge ${getCategoryClass(product.category)}`}>
                            {product.category}
                          </span>
                        </td>
                        <td className="product-price-cell">
                          <span className="price-tag font-mono">
                            {formatPrice(product.price)}
                          </span>
                        </td>
                        <td className="product-desc-cell">
                          <span className="truncate-text" title={product.description}>
                            {product.description}
                          </span>
                        </td>
                        <td className="product-date-cell font-mono">
                          {formatDate(product.createdAt)}
                        </td>
                        <td className="product-actions-cell text-right">
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="btn btn-action-edit"
                            title="Edit product"
                          >
                            <svg
                              className="action-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleOpenDelete(product)}
                            className="btn btn-action-delete"
                            title="Delete product"
                          >
                            <svg
                              className="action-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-footer">
                <span className="font-mono table-count-text">
                  Showing <strong>{products.length}</strong> {products.length === 1 ? 'item' : 'items'} in catalog
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Form Modal (Create / Edit) */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={deletingProduct ? deletingProduct.name : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProductsPage;
