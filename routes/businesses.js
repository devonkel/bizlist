var express = require('express');
var router = express.Router();
var nodeCouchDB = require('node-couchdb');
var couch = new nodeCouchDB('localhost', 5984);
var uuid = require('node-uuid');
var validator = require('express-validator');

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

router.post('/add', function(req, res, next) {
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('category', 'Category is required').notEmpty();
  req.checkBody('category', 'Category is required').notZero();
  req.checkBody('city', 'City is required').notEmpty();
  req.checkBody('state', 'State is required').notEmpty();

  var errors = req.validationErrors();
  if (errors){
    res.render('addbusiness', {errors: errors});
  } else {
    couch.insert('bizlist', {
      _id: uuid.v1(),
      name: req.body.name,
      category: req.body.category,
      website: req.body.website,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    }, function(err, resData) {
        if(err) {
          res.send(err);
        } else {
          res.redirect('/');
        }
    });
  }
});

module.exports = router;
