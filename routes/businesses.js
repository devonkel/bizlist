var express = require('express');
var router = express.Router();
var nodeCouchDB = require('node-couchdb');
var couch = new nodeCouchDB('localhost', 5984);
var uuid = require('node-uuid');

router.get('/', function(req, res, next) {
  res.render('businesses');
});

router.get('/add', function(req, res, next) {
  res.render('addbusiness');
});

router.get('/show/:id', function(req, res, next) {
  res.render('show');
});

router.get('/edit/:id', function(req, res, next) {
  res.render('editbusiness');
});

router.get('/category/:category', function(req, res, next) {
  res.render('businesses');
});

module.exports = router;
