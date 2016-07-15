var express = require('express');
var pelis = require('./pelis');
var url = require('url');
var fs = require('fs');
// var router = express.Router();
var app = express();

/* exportamos los módulos y creamos funciones */
module.exports = function(app){
	index = function(req, res) {
		var dir = __dirname + '/../views/index'
		res.render(dir, {});
	}, 
	list = function (req, res) {
		pelis.find(function(err, peliculas) {
			if (err) {
				console.log(__pathname + " Error desconocido");
			} else {
				res.render('list', {arraysPelis : peliculas});
			}
		});
	}, 
	listOne = function(req, res) {
		var peliBuscada = req.query.valor;
		var pulsaBoton = req.query.boto == "listar";
		pelis.findOne({codpeli : peliBuscada}, function(err, peli){
			if (err) {
				console.log(__pathname + " no ha puesto la id correcta");
			} else {
				res.render('listOne', {pulsaBoton : pulsaBoton, peli : peli});
			}
		});
	},
	update = function(req,res) {
		var codpeli = req.query.codpeli + "";
		var titol = req.query.titol + "";
		var sinopsi = req.query.sinopsi + "";

		if (codpeli != null && titol != null && sinopsi != null) {
			var objetoCondicion = {codpeli : codpeli}; // objeto en el cual va la condición
			var objetoActualizar = {codpeli : codpeli, titol : titol, sinopsi : sinopsi}; // objeto donde vamos a cambiar lo que nos pasan
			pelis.update(objetoCondicion, {$set : objetoActualizar}, function(err, peli) {
				if (err) {
					console.log(__pathname + " Error al actualizar la película");
				}
			});
		}

		pelis.find(function(err, peliculas) {
			var _id = req.query._id;

			if (_id != null) {
				// pasaré a los campos los valores de la pelicula que elija
				pelis.findOne({_id : Object(_id)}, function(err, peli) {
					if (err) {
						console.log(__pathname + " no ha puesto la id correcta");
					} else {
						res.render('update', {
							arraysPelis : peliculas,
							idpeli : peli.codpeli,
							nombrePeli : peli.titol,
							sinopsi : peli.sinopsi
						});
					}
				});
			} else {
				res.render('update', {
					arraysPelis : peliculas,
					idpeli : null,
					nombrePeli : "",
					sinopsi : ""
				});
			}
		});
	},
	delete1 = function(req,res) {
		// listo las peliculas
		pelis.find(function(err, peliculas) {
			if (err) {
				console.log(__pathname + " no ha puesto la id correcta");
			} else {
				res.render('delete', {arraysPelis : peliculas});
			}
		});
		// y las borro
		pelis.remove({ _id:Object(req.query._id)}).exec();
	},
	insert = function(req,res) {
		titulo = req.query.titol;
		sinopsi = req.query.sinopsi;

		pelis.find(function(err, peliculas) {	
			if (err) {
				console.log(__pathname + " no ha puesto la id correcta");
			} else {
				var codigoIngresar = 1;
				// creo un array donde pondré todos los códigos de las películas
				var arrayCodPelis = [];
				for (var i = 0; i < peliculas.length; i++) {
					arrayCodPelis.push(peliculas[i].codpeli);
				};
				// voy buscando un codigo de pelicula que no sea repetido
				while (arrayCodPelis.indexOf(codigoIngresar + "") != -1) {
					codigoIngresar++;
				}

				// si no me pasan nada vacio y pulsan el boton insertar añado la película
				if (titulo != "" && sinopsi != "" && req.query.boto == "insertar") {
					var nuevaPeli = new pelis({
						codpeli : codigoIngresar,
						titol : titulo,
						sinopsi : sinopsi
					});
					nuevaPeli.save(function(err, nueva) {
						if (err) console.error(err);
						console.log("se ha guardado la pelicula \"" + nueva.titol + "\"");
					});
				}
				res.render('insert', {title : titulo});
			}
		});
	}
	app.get('/', index);
	app.get('/listOne', listOne);
	app.get('/list', list);
	app.get('/update', update);
	app.get('/insert', insert);
	app.get('/delete', delete1);
};


//app.get('/', exit.index);
/* funcion para convertir de objeto a cadena
function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}
*/
