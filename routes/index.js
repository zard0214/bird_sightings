var express = require('express');
const Bird = require("../controllers/bird");
var router = express.Router();

router.get('/', function(req, res, next) {
  Bird.fetchRecords(req, res);
  // res.render('index', {page:'Record', menuId:'home'});
});

router.get('/nearby', function(req, res, next) {
  res.render('nearby', {title:'Nearby', menuId:'about'});
});

module.exports = router;
