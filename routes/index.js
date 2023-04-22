var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {page:'Record', menuId:'home'});
});

router.get('/nearby', function(req, res, next) {
  res.render('nearby', {page:'Nearby', menuId:'about'});
});

module.exports = router;
