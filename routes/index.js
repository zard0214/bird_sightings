var express = require('express');
const Bird = require("../controllers/bird");
const bird= require("../models/bird");
const formidable = require('formidable');
const {findNearbyBirds} = require("../controllers/bird");

var router = express.Router();

/**,
 * @swagger
 * /:
 *    get:
 *      tags:
 *      - get sightings record
 *      summary: get chat record
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/
 * */
router.get('/', function(req, res, next) {
    Bird.fetchSightingWithPage(req,res)
});

/**,
 * @swagger
 * /record:
 *    get:
 *      tags:
 *      - get sightings record
 *      summary: get chat record
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/record
 * */
router.post('/record', function(req, res, next) {
    console.log("1")
});

/**,
 * @swagger
 * /search:
 *    get:
 *      tags:
 *      - get sightings record
 *      summary: get chat record
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/record
 * */
router.get('/search', async (req, res) => {
    Bird.searchRecords(req, res);
});

/**,
 * @swagger
 * /detail:
 *    get:
 *      tags:
 *      - get sightings record by id
 *      summary: get chat record by id
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/record
 * */
router.get('/detail', function(req, res, next) {
    Bird.findRecordById(req, res);
});

/**,
 * @swagger
 * /detail:
 *    post:
 *      tags:
 *      - change the identification of sighting birds
 *      summary: the identification of sighting birds
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/detail
 * */
router.post('/detail', function(req, res, next) {
  Bird.changeIdentification(req,res);
});

/**,
 * @swagger
 * /upload:
 *    post:
 *      tags:
 *      - upload sighting birds reocrd
 *      summary: gupload sighting birds reocrds
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/upload
 * */
router.get('/upload', (req, res) => {
    const body = req.query;
    let nickname = req.session.nickname
    console.log( nickname)

    res.render('upload', { title: 'UPLOAD', menuId: 'upload',bird:bird,nickname:nickname});
});

/**,
 * @swagger
 * /nearby:
 *    get:
 *      tags:
 *      - get nearby sighting record
 *      summary: get nearby sighting record
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/upload
 * */
// Backend routes
router.get('/nearby', function(req, res, next) {
    let nickname = req.session.nickname
    // Handle the GET request for the map view
    res.render('map', { title: 'Nearby Birds', menuId: 'nearby', birds: [] ,nickname:nickname });
});

/**,
 * @swagger
 * /nearby:
 *    post:
 *      tags:
 *      - get nearby sighting record
 *      summary: get nearby sighting record
 *      produces:
 *      - application/json
 *     parameters:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/upload
 * */
router.post('/nearby', function(req, res, next) {
    // Access the form data from the request body

Bird.findNearbyBirds(req,res)


});
module.exports = router;
