var express = require('express');
var router = express.Router();
var nodeCouchDB = require('node-couchdb');
var couch = new nodeCouchDB('localhost', 5984);
var uuid = require('node-uuid');
var validator = require('express-validator');
var dbName = "bizlist";
var viewByNameURL = "_design/name/_view/vw_byName";
var viewByIDURL = "_design/id/_view/vw_byID";

router.get('/', function(req, res, next) {
  var dbName = "bizlist";
  var viewByNameURL = "_design/name/_view/vw_byName";
  var queryOptions = {};
  couch.get(dbName, viewByNameURL, queryOptions).then(({data, headers, status}) => {
    res.render('businesses', {businesses: data.rows});
  }, err => {
    res.send(err.code);
  });
});

router.get('/add', function(req, res, next) {
  res.render('addbusiness');
});

router.get('/show/:id', function(req, res, next) {
  couch.get(dbName, req.params.id).then(({data, headers, status}) => {
    res.render('show', {business: data});
  }, err => {
    console.log('Error in couch.get/show/:id');
    res.send(err.code);
  });
});

router.get('/edit/:id', function(req, res, next) {
  couch.get(dbName, req.params.id).then(({data, headers, status}) => {
    res.render('editbusiness', {business: data});
  }, err => {
    console.log('Error in couch.get/edit/:id');
    res.send(err.code);
  });
});

router.post('/edit/:id', function(req, res, next) {
  couch.get(dbName, req.params.id).then(({data, headers, status}) => {
    couch.update(dbName, {
      _id: req.params.id,
      _rev: uuid.v1(),
      name: req.params.name,
      category: req.params.category,
      address: req.params.address,
      city: req.params.city,
      state: req.params.state,
      zip: req.params.zip,
      website: req.params.website,
      phone: req.params.phone
    }).then(({data, headers, status}) => {
      console.log('### Updated record: ', data);
      res.render('show', {business: data});
    }, err => {
      console.log('Update error in couch.post/edit/:id');
      res.send(err.code);
    });
  }, err => {
    console.log('Get error in couch.post/edit/:id');
    res.send(err.code);
  });
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
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip
    }).then(({data, headers, status}) => {
      req.flash('Business Updated');
      res.redirect(200, '/businesses/show/:id');
    }, err => {
      console.log('!!! ERROR on business insert into couch', err.code);
      res.send(err.code);
    });
  }
});

router.post('/delete/:id', function(req, res, next){
  console.log('DDD About to Delete :', req.params.id);
  couch.get(dbName, req.params.id).then (({data, headers, status}) => {
    var rev = data._rev;
    couch.del(dbName, req.params.id, rev).then(({data, headers, status}) => {
      console.log('DDD Successfully deleted.');
      req.flash('success', 'Business Removed');
      res.redirect('/businesses');
    }, err => {
      console.log('### Error in /delete:couch.del: '+dbName+'|'+'|'+req.params.id+'|'+rev);
      res.send(err.code);
    });
  }, err => {
    console.log('### Error in /delete:couch.get: '+dbName+'|'+'|'+req.params.id);
    res.send(err.code);
  });
});

module.exports = router;
