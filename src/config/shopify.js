const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOPNAME,
  accessToken: process.env.SHOPIFY_PASSWORD,
  apiVersion: '2025-01'
});

module.exports = shopify