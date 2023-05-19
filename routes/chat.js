var express = require('express');
const Chat = require("../controllers/chat");

var router = express.Router();
router.post('/insert', async (req, res) => {
    Chat.insert(req, res);
});

/**,
 * @swagger
 * /fetchChatRecordList:
 *    get:
 *      tags:
 *      - get chat record
 *      summary: get chat record
 *      produces:
 *      - application/json
 *     parameters:
 *      - id: userid
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/logout
 * */
router.get('/fetchChatRecordList', async (req, res) => {
    Chat.fetchChatRecordList(req, res);
});

module.exports = router;
