var express = require('express');
const Bird = require("../controllers/bird");
const bird= require("../models/bird");
const formidable = require('formidable');
const {findNearbyBirds} = require("../controllers/bird");

var router = express.Router();

router.get('/', function(req, res, next) {
    Bird.fetchSightingWithPage(req,res)
});
router.post('/record', function(req, res, next) {
    console.log("1")
});
router.get('/search', async (req, res) => {
    Bird.searchRecords(req, res);
});

router.get('/detail', function(req, res, next) {
    Bird.findRecordById(req, res);
});
router.post('/detail', function(req, res, next) {
  Bird.changeIdentification(req,res);
});


router.get('/upload', (req, res) => {
    const body = req.query;
    let nickname = req.session.nickname
    console.log( nickname)

    res.render('upload', { title: 'UPLOAD', menuId: 'upload',bird:bird,nickname:nickname});
});
// Backend routes
router.get('/nearby', function(req, res, next) {
    let nickname = req.session.nickname
    // Handle the GET request for the map view
    res.render('map', { title: 'Nearby Birds', menuId: 'nearby', birds: [] ,nickname:nickname });
});


router.post('/nearby', function(req, res, next) {
    // Access the form data from the request body

Bird.findNearbyBirds(req,res)


});
module.exports = router;
