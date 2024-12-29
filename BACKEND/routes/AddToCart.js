const express = require('express');
const router = express.Router();
const AddToCart = require('../models/AddToCart');
const SparePart = require('../models/SparePart');

// GET all products according to customer ID
router.get('/cart-details/:id', async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer_cart = await AddToCart.find({ userId: customerId });

    if (!customer_cart || customer_cart.length === 0) {
      return res.json({ message: "Cart is empty" });
    }

    // Fetch product images for each item in the cart
    const cartDetailsWithImages = await Promise.all(
      customer_cart.map(async (item) => {
        const imageDetails = await SparePart.findOne({ _id: item.productId });
        return {
          ...item._doc, // Spread the cart item details
          productImage: imageDetails ? imageDetails.image : null // Add product image URL
        };
      })
    );

    res.json(cartDetailsWithImages);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/add', async (req, res) => {
  console.log("Request Body:", req.body);
  const { userId, productId, productImage, productName, productDescription, productPrice, categoryId, quantity } = req.body;
  try {
    // Check if the item already exists in the cart
    let cartItem = await AddToCart.findOne({ userId, productId });
    if (cartItem) {
      // Update quantity if item already exists
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Add new item to cart
      cartItem = new AddToCart({
        userId,
        productId,
        productImage,
        productName,
        productDescription,
        productPrice,
        categoryId, // Ensure categoryId is included here
        quantity
      });
      await cartItem.save();
    }
    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// PUT update quantity of item in cart
router.put('/quantity_update/:cartItemId', async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  // Log the entire req.body to see its contents
  console.log("Request Body:", req.body);

  // Log the quantity to ensure it's being extracted correctly
  console.log("Quantity:", quantity);

  const parsedQuantity = parseInt(quantity);

  if (isNaN(parsedQuantity)) {
    // Handle invalid quantity
    return res.status(400).json({ message: 'Invalid quantity value' });
  }

  // Log parsed quantity to ensure it's parsed correctly
  console.log("Parsed Quantity:", parsedQuantity);

  try {
    // Find the cart item by ID and update its quantity
    const updatedCartItem = await AddToCart.findByIdAndUpdate(
      cartItemId,
      { $inc: { quantity: parsedQuantity } }, // Increment the quantity by parsedQuantity
      { new: true } // Return the updated document
    );

    if (!updatedCartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json(updatedCartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Removing a specific product
router.delete('/cart_remove/:customerId/:productId', async (req, res) => {
  try {
    const { customerId, productId } = req.params;
    const deletedItem = await AddToCart.findOneAndDelete({ userId: customerId, productId: productId });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Product not found for this customer' });
    }
    res.json({ message: 'Product deleted successfully', item: deletedItem });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Removing all products after purchasing
router.delete('/cart_remove_after_purchase/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const deletedItems = await AddToCart.deleteMany({ userId: customerId });
    if (deletedItems.deletedCount === 0) {
      return res.status(404).json({ message: 'No products found for this customer' });
    }
    res.json({ message: 'All products deleted successfully' });
  } catch (error) {
    console.error('Error deleting products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
