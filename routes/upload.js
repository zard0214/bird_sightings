const express = require('express');
const router = express.Router();
const {uploadBird} = require("../controllers/creatbird");

/**,
 * @swagger
 * /add:
 *    post:
 *      tags:
 *      - add sighting birds record
 *      summary: add sighting birds record
 *      produces:
 *      - application/json
 *     parameters:
 *      - identification: identification
 *        location: location
 *        latitude: latitude
 *        picture: picture
 *        description: description
 *        witnesses: witnesses
 *        code: code
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/logout
 * */
router.post('/add', uploadBird);

module.exports = router;
