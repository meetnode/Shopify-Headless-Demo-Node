let express = require('express');
const indexController = require('../controller')
let router = express.Router();

router.get('/', indexController.index);
router.get('/home', indexController.home)

router.get('/products', indexController.products);
router.get('/products/:id', indexController.product);

router.get('/collections', indexController.collections);
router.get('/collections/:id', indexController.collection);

router.route('/cart').post(indexController.addToCart)
router.get('/aboutus', indexController.aboutus)

router.post('/customer', indexController.customerCreate)
router.post('/customer-login', indexController.loginCustomer)

router.get('/checkout', indexController.checkout)

module.exports = router;
