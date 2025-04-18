import express from 'express'
import Product from '../Models/Product.js'
import catchAsync from '../Core/catchAsync.js'
import {BadRequestError, InternalServerError} from '../Core/ApiError.js'
import Logger from '../Core/Logger.js'

const router = express.Router(); // Creates a new instance of an Express Router. The Router in Express is like a mini Express application that you can use to handle routes separately instead of defining all routes in server.js.

// Get All products
router.get('/products', catchAsync(async(req, res) => {
  Logger.info("Fetch all products request received")
  const products = await Product.find({})
  if (!products || products.length === 0) throw new BadRequestError('Products not found');
  res.status(200).json({status: 'success', message: 'Fetched all the products successfully',  data: products });
  // Logger.info("All products received successfully", {data: products})
}));

// Creating the new Product
router.post('/products', catchAsync(async(req, res) => {
  Logger.info("Create the product request received", { body: req.body })
  const { title, description, image, price } = req.body;

  const newProduct = await Product.create(
    { 
      title, 
      description, 
      image, 
      price: parseFloat(price) 
    }
  );

  if (!newProduct) throw new InternalServerError('Failed to create product');

  res.status(201).json({status: 'success', message: 'Product created successfully',  data: newProduct });
}));

router.route('/products/:productId')
// Show a product
.get(catchAsync(async(req, res) => {
  Logger.info("Show the product request received")
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) throw new BadRequestError('Product not found');

  res.status(200).json(product);
}))
// Update a product
.patch(catchAsync(async(req, res) => {
  Logger.info("Update the product request received")
  const { productId } = req.params;
  const { title, description, image, price } = req.body;
  const product = await Product.findByIdAndUpdate(
    productId, 
    { 
      title, 
      description, 
      image, 
      price: parseFloat(price) 
    }, 
    { new: true, runValidators: true }); // Returns the updated document

  if (!product) throw new BadRequestError('Product not found');

  res.status(200).json({status: 'success', message: 'product updated successfully',  data: product });
}))
// Delete a product
.delete(catchAsync(async(req, res) => {
  Logger.info("Delete the product request received")
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);

  if (!product) throw new BadRequestError('Product not found');

  res.status(200).json({status: 'success', message: 'product deleted successfully' });
}));

export default router;