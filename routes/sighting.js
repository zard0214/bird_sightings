var express = require('express');
var router = express.Router();
const Bird = require('../controllers/bird');

/**,
 * @swagger
 * /login:
 *    get:
 *      tags:
 *      - fetchSightingWithPage
 *      summary: /sighting/fetchSightingWithPage
 *      produces:
 *      - application/json
 *      parameters:
 *      - Witnesses: witnesses
 *        in: query
 *        description: witnesses username
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
router.get('/fetchSightingWithPage', (req, res) => {
    Bird.fetchSightingWithPage(req, res);
});


module.exports = router
