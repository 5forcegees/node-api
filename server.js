var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// seed the db from the client scripts
var db_seed = require('./scripts/db_seed');
db_seed.populate_db();

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded());

var port     = process.env.PORT || 8080; // set our port
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/phase1'); // connect to our database
var Cart     = require('./app/models/cart');
var User     = require('./app/models/user');
var Product     = require('./app/models/product');


// ROUTES
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to our API' });
});

// on routes that end in /reviewCart
// ----------------------------------------------------
router.get('/reviewCart', function(req, res) {
	Cart.find({product: /^.+$/ }, function (err, result){
		if (err) {
			res.send(err);
		} else {
			if (result.length) {
				res.json(result);
			} else {
				res.json({message: 'no cart contents'});
			}
		}
	})
});

// on routes that end in /reviewCart
// ----------------------------------------------------
router.post('/addToCart', function(req, res) {
	var productId = '';
	var product = '';
	if (req.body.productId) {
		productId = req.body.productId;
		Product.find({product: new RegExp(productId)}, function (err, result) {
			if (err) {
				res.send(err);
			} else {
				if (result.length) {
					console.log('result', result[0]);

					var addCart = new Cart();
					addCart.product = result[0].product;
					addCart.save(function (err) {
						if (err) {
							console.log('error loading product');
							res.json({success: false, message: addCart});

						} else {
							console.log('populating db with cart ', addCart.product);
							res.json({success: true, message: addCart});
						}
					});
				} else {
					res.json({success: false, message: 'no matching products'})
				}
			}
		});

	}
});

// routes that end with /login
router.post('/login', function (req, res, next) {
	User.find({name: req.body.name, password: req.body.password }, function (err, result){
		if (err) {
			res.send(err);
		} else {
			if (result.length) {
				res.json({success: true, message: 'Login successful'});
			} else {
				res.json({success: false, message: 'Username and/or Password incorrect'});
			}
		}
	})
});

router.post('/search', function (req, res, next) {
	var searchCriteria = '';
	if (req.body.criteria) {
		searchCriteria = req.body.criteria.toString();
	}
	Product.find({product: new RegExp(searchCriteria, 'i') }, function(err, result) {
		if (err){
			res.send(err);
		} else {
			if (result.length){
				res.json({success: true, message: result});
			} else {
				res.json({success: false, message: 'no matching products'})
			}
		}
	})
});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
