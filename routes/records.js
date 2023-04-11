var express = require('express');
var router = express.Router();

/**,
 * @swagger
 * /: #
 *    get:
 *      tags: #records
 *      - index
 *      summary: record of the birds
 *      produces:
 *      - application/json
 *      parameters:
 *      - parameter 1: p
 *      responses:
 *        200:
 *          description: successful operation
 *        505:
 *          description: service error
 * */
router.get('/add', function(req, res, next) {
    res.render('addrecords', { title: 'Add Record' });
});

module.exports = router;
