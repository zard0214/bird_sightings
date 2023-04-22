var express = require('express');
const Bird = require("../controllers/bird");
var router = express.Router();

router.get('/', function(req, res, next) {
    Bird.fetchRecords(req, res);
});

router.get('/detail', function(req, res, next) {
    Bird.findRecordById(req, res);
});


router.get('/nearby', function(req, res, next) {
    res.render('nearby', {title:'Nearby', menuId:'about'});
});

module.exports = router;
