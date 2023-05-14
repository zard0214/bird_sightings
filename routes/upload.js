const express = require('express');
const router = express.Router();
const {uploadBird} = require("../controllers/creatbird");

router.post('/add', uploadBird);

module.exports = router;
