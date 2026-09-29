const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Get all products (with optional search)
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { name: { $regex: searchRegex } },
          { category: { $regex: searchRegex } }
        ]
      };
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    // Explicit validation matching requirements
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Product name is required' });
    }

    if (price === undefined || price === null || price === '') {
      return res.status(400).json({ message: 'Product price is required' });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({ message: 'Product category is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Product description is required' });
    }

    const product = await Product.create({
      name: name.trim(),
      price: numericPrice,
      category: category.trim(),
      description: description.trim(),
      user: req.user._id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price, category, description } = req.body;

    // Validation
    if (name !== undefined) {
      if (name.trim() === '') {
        return res.status(400).json({ message: 'Product name cannot be empty' });
      }
      product.name = name.trim();
    }

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
      }
      product.price = numericPrice;
    }

    if (category !== undefined) {
      if (category.trim() === '') {
        return res.status(400).json({ message: 'Product category cannot be empty' });
      }
      product.category = category.trim();
    }

    if (description !== undefined) {
      if (description.trim() === '') {
        return res.status(400).json({ message: 'Product description cannot be empty' });
      }
      product.description = description.trim();
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Product deleted successfully',
      id: id
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
