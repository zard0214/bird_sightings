var express = require('express');
const Bird = require("../controllers/bird");
const bird= require("../models/bird");

var router = express.Router();

router.get('/', function(req, res, next) {
    Bird.fetchRecords(req, res);
});
router.get('/search', async (req, res) => {
    Bird.searchRecords(req, res);
});

router.get('/detail', function(req, res, next) {
    Bird.findRecordById(req, res);
});

router.get('/upload', (req, res) => {
    res.render('upload', { title: 'UPLOAD', menuId: 'upload' });
});

router.get('/nearby', function(req, res, next) {
   Bird.findNearbyBirds(req,res);
});

module.exports = router;
