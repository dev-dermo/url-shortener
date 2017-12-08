var express = require('express');
var ejs = require('ejs');
var path = require('path');
var base62 = require('base62');
var validUrl = require('valid-url');
var Url = require('./Url.model');
var mongoose = require('mongoose');
var db = 'mongodb://admin:password1@ds119476.mlab.com:19476/short-urls';
// var db = 'mongodb://localhost:27017/test';
mongoose.connect(db);

var app = express();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/:short_url', function(req, res) {
	var short_url = req.params.short_url;
	var decoded = base62.decode(short_url);

	Url.findOne({
		_id: decoded
	}).exec(function(err, url) {
		if (err) {
			console.error('error getting url');
		} else {
			res.redirect(url.url);
		}
	});
});

app.get('/new/*', function(req, res) {
	var result = {};
	var longUrl = req.params[0];

	if (validUrl.isWebUri(longUrl)) {
		var newUrl = new Url();
		newUrl.url = longUrl;

		newUrl.save(function(err, url) {
			if (err) {
				console.error(err);
				res.send('Error saving url');
			} else {
				result.original_url = longUrl;

				Url.findOne({
					url: longUrl
				}).exec(function(err, url) {
					if (err) {
						console.error('error getting url');
					} else {
						result.short_url = 'http://' + req.get('host') + '/' + base62.encode(url._id);
						res.json(result);
					}
				});
			}
		});
	} else {
		result.error = 'The uri provided was not valid';
		res.json(result);
	}
});

app.listen(app.get('port'), function() {
	console.log('App started on port ' + app.get('port'));
});