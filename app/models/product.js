var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductSchema   = new Schema({
	product: String
});

module.exports = mongoose.model('Product', ProductSchema);