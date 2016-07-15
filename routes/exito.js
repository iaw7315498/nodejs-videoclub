var express = require('express');
var router = express.Router();

module.exports = {
	list : function(req, res) {
		console.log("asdsa");
	},
	listOne : function(req, res) {
		console.log("entra");
		return "hola!";
	}
};