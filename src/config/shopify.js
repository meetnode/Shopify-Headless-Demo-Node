const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOPNAME,
  apiKey: process.env.SHOPIFY_APIKEY,
  password: process.env.SHOPIFY_PASSWORD,
  // apiVersion: '2025-01'
});

module.exports = shopify