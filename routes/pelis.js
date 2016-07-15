var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	var SchemaPeli = new Schema({
		codpeli : String,
		titol : String,
		sinopsi : String
	});

module.exports = mongoose.model('pelis', SchemaPeli);