// const { createAdminApiClient } = require('@shopify/admin-api-client');
// const { shopifyApi, LATEST_API_VERSION, Session } = require('@shopify/shopify-api');
// const { GET_HOMEPAGE_QUERY } = require('../constants/query');
// require('@shopify/shopify-api/adapters/node');

// const shopifyss = shopifyApi({
//     apiKey: '3cff6f73a87e152c4550ad86721c6cbe',
//     apiSecretKey: 'd2a290549eaf3329aadc4657681faa9d',
//     scopes: [
//         'read_customers',
//         'write_customers',
//         'unauthenticated_read_customers',
//         'unauthenticated_write_customers'
//     ],
//     hostName: '3d-products-cc.myshopify.com',
//     apiVersion: '2024-07',
//     adminApiAccessToken: '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',
//     // isCustomStoreApp: true
// });

// const sessionsss = shopifyss.session.customAppSession("3d-products-cc.myshopify.com")

// const clientsNew = new shopifyss.clients.Storefront({
//     domain: '3d-products-cc.myshopify.com',
//     session: sessionsss,
//     storefrontAccessToken: "ce22a6295d6f4bc7bebd5d7adf091c47",
// });


// async function makeGraphQLCall() {
//     try {
//         const data = await clientsNew.query({
//             data: `mutation customerAccessTokenCreate {
//               customerAccessTokenCreate(input: {email: "meetnode@gmail.com", password: "Meet@123"}) {
//                 customerAccessToken {
//                   accessToken
//                 }
//                 customerUserErrors {
//                   message
//                 }
//               }
//             }`,
//         });
//         console.log('Response:', data.body.data);
//     } catch (error) {
//         console.error(error?.body?.errors?.message || error);
//     }
// }

// makeGraphQLCall();

const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOPNAME,
  // apiKey: process.env.SHOPIFY_APIKEY,
  // password: process.env.SHOPIFY_PASSWORD,
  accessToken: process.env.SHOPIFY_PASSWORD,
  apiVersion: '2025-01'
});

module.exports = shopify