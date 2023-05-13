var express = require('express');
const Chat = require("../controllers/chat");

var router = express.Router();
router.post('/insert', async (req, res) => {
    Chat.insert(req, res);
});

module.exports = router;
