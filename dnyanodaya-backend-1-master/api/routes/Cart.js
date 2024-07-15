// routes/cart.js

const express = require('express');
const router = express.Router();
const Cart = require('../model/Cart');
const Product = require('../model/Product')
// Add a product to the user's cart
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
 console.log("cart",req.body)
    // Check if the user already has a cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product is already in the cart, if yes, update the quantity
    const existingCartItem = cart.items.find(item => item.productId.equals(productId));

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// router.get('/get-cart/:userId', async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       console.log("cart", req.params)

//       // Find the cart for the given user
//       const cart = await Cart.findOne({ userId });
  
//       if (!cart) {
//         return res.status(404).json({ message: 'Cart not found' });
//       }
//   console.log(cart)
//       res.json(cart);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
  
// Import any necessary modules and models

router.get('/get-cart/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("cart", req.params)
  
      // Find the cart for the given user
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Extract the product IDs from the cart
      const productIds = cart.items.map(item => item.productId);
  
      // Fetch product details for the product IDs in the cart
      const productsInCart = await Product.find({ _id: { $in: productIds } });
  
      // Combine cart items with product details
      const cartWithProductDetails = cart.items.map(item => {
        const product = productsInCart.find(product => product._id.equals(item.productId));
        return {
          productId: item.productId,
          quantity: item.quantity,
          product: product, // Include the complete product data
        };
      });
  
      res.json(cartWithProductDetails);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Remove a product from the user's cart
router.delete('/remove-from-cart', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
 