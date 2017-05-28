
var mongoose = require('mongoose');

var MovieSchema = mongoose.Schema({
    title : String,
	releaseYear: String,
	director: String,
	genre:String
});

module.exports = mongoose.model('Movie', MovieSchema);
