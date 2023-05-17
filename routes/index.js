var express = require('express');
const Bird = require("../controllers/bird");
const bird= require("../models/bird");
const formidable = require('formidable');
const {findNearbyBirds} = require("../controllers/bird");



var router = express.Router();

router.get('/', function(req, res, next) {
  Bird.sortBirds(req,res)

});
router.get('/search', async (req, res) => {
    Bird.searchRecords(req, res);
});

router.get('/detail', function(req, res, next) {
    Bird.findRecordById(req, res);
});

router.get('/upload', (req, res) => {
    res.render('upload', { title: 'UPLOAD', menuId: 'upload',bird:bird });
});
// Backend routes
router.get('/nearby', function(req, res, next) {
    let nickname = req.session.nickname
    // Handle the GET request for the map view
    res.render('map', { title: 'Nearby Birds', menuId: 'nearby', birds: [] ,nickname:nickname });
});


router.post('/nearby', function(req, res, next) {
    // Access the form data from the request body
  findNearbyBirds(req,res)

});


module.exports = router;
