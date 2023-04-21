var express = require('express');
var router = express.Router();
const Bird = require('../controllers/bird');

/**,
 * @swagger
 * /login:
 *    get:
 *      tags:
 *      - recordPage
 *      summary: /sighting/recordPage
 *      produces:
 *      - application/json
 *      parameters:
 *      - Witnesses: Witnesses
 *        in: query
 *        description: Witnesses username
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/sighting/recordPage
 *        500:
 *          description: Internal server error
 * */
router.get('/recordPage', (req, res) => {
    Bird.findSightingPage(req, res);
});


module.exports = router
