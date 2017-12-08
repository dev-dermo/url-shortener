var autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
	url: String
});

autoIncrement.initialize(mongoose.connection);
UrlSchema.plugin(autoIncrement.plugin, 'Url');
module.exports = mongoose.model('Url', UrlSchema);