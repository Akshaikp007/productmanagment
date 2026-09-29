import { useState, useEffect } from 'react';

const CATEGORIES = [
  'Electronics',
  'Computers & Accessories',
  'Furniture & Decor',
  'Clothing & Apparel',
  'Kitchen & Dining',
  'Books & Stationery',
  'Sports & Outdoors',
  'Other'
];

const ProductForm = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const isEditMode = Boolean(initialData && initialData._id);

  // Populate or reset form whenever modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price !== undefined && initialData.price !== null ? initialData.price.toString() : '',
        category: initialData.category || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    // 1. Name required
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Product name is required';
    }

    // 2. Price required & greater than 0
    if (formData.price === '' || formData.price === null || formData.price === undefined) {
      newErrors.price = 'Price is required';
    } else {
      const numPrice = Number(formData.price);
      if (isNaN(numPrice) || numPrice <= 0) {
        newErrors.price = 'Price must be greater than 0';
      }
    }

    // 3. Category required
    if (!formData.category || formData.category.trim() === '') {
      newErrors.category = 'Category is required';
    }

    // 4. Description required
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for field once user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="product-name" className="form-label">
                Product Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="product-name"
                name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Ergonomic Office Chair"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Price & Category row */}
            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="product-price" className="form-label">
                  Price ($) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  id="product-price"
                  name="price"
                  className={`form-input ${errors.price ? 'input-error' : ''}`}
                  placeholder="e.g. 199.99"
                  value={formData.price}
                  onChange={handleChange}
                />
                {errors.price && <span className="field-error">{errors.price}</span>}
              </div>

              <div className="form-group flex-1">
                <label htmlFor="product-category" className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <input
                  list="category-suggestions"
                  type="text"
                  id="product-category"
                  name="category"
                  className={`form-input ${errors.category ? 'input-error' : ''}`}
                  placeholder="Select or enter category"
                  value={formData.category}
                  onChange={handleChange}
                />
                <datalist id="category-suggestions">
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="product-description" className="form-label">
                Description <span className="text-danger">*</span>
              </label>
              <textarea
                id="product-description"
                name="description"
                rows="4"
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                placeholder="Detailed description of the product features, specifications, etc."
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && (
                <span className="field-error">{errors.description}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="save-product-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-sm"></span>
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : isEditMode ? (
                'Update Product'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
