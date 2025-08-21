const express = require('express');
const router = express.Router();
const {addToCart,getCart,removeFromCart,updateCart,clearCart} = require('../Controllers/Cart.cjs');

// Attach the addToCart function to the route
router.post('/',getCart);
router.post('/addToCart', addToCart);
router.delete('/removeFromCart',removeFromCart);
router.patch('/updateCart', updateCart); 
router.post('/clearCart',clearCart);

// Export the router
module.exports = router;
