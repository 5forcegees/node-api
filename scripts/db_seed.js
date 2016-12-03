var mongoose   = require('mongoose');
var Cart     = require('./../app/models/cart');
var User     = require('./../app/models/user');
var Product     = require('./../app/models/product');

// this script populates the db with the json data provided by the client to use for development
// in testing and production this will already be integrated so populating the data won't be needed
exports.populate_db = function () {
    var cartContents = require('./seed_data/cartInitialization.json');
    Cart.find({product: cartContents.product }, function(err, existingCart) {
        if (err) {
            console.log('error retrieving cart: ', err);
        } else {
            if (!existingCart.length) {
                var cart = new Cart();

                cart.product = cartContents.product;

                cart.save(function (err) {
                    if (err) {
                        console.log('error loading product');
                    } else {
                        console.log('populating db with product ', product);
                    }
                });
            } else {
                console.log('found cart:', existingCart);
            }
        }
    });

    var product = new Product();
    var productContents = require('./seed_data/productInitialization.json');
    Product.find({product: productContents.product }, function(err, existingProduct) {
        if (err) {
            console.log('error retrieving product: ', err);
        } else {
            if (!existingProduct.length) {
                product.product = productContents.product;

                product.save(function (err) {
                    if (err) {
                        console.log('error loading product');
                    } else {
                        console.log('populating db with product ', product);
                    }
                });
            } else {
                console.log('found product:', existingProduct);
            }
        }
    });

    var user = new User();
    var userData = require('./seed_data/userInitialization.json');
    User.find({name: userData.name, password: userData.password }, function(err, existingUser) {
        if (err) {
            console.log('error retrieving user: ', err);
        } else {
            if (!existingUser.length) {
                user.name = userData.name;
                user.password = userData.password;
                user.save(function (err) {
                    if (err) {
                        console.log('error loading user');
                    } else {
                        console.log('populating db with user ', user);
                    }
                });
            } else {
                console.log('found User:', existingUser);
            }
        }
    });
};
