const SparePart = require('../models/SparePart');

async function getBaseLifespanForProduct(productId) {
    try {
        const product = await SparePart.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product.baseLifespan; // Return the baseLifespan from the found product
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

module.exports = { getBaseLifespanForProduct };
