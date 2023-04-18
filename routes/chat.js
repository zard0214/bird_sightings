var express = require('express');
var router = express.Router();
var bodyParser= require("body-parser");

var character = require('../controllers/bird_watching');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('chat', { title: 'My Chat' });
});

module.exports = router;
