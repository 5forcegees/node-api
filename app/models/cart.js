var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CartSchema   = new Schema({
	product: String
});

module.exports = mongoose.model('Cart', CartSchema);