const express = require('express');
const router = express.Router();
const { uploadBird } = require("../controllers/creatbird");

router.post('/add', uploadBird);

router.post('/identifier', (req, res, next) => {
    const query = saveBirdSighting({
        body: req.body,
    });
    res.send({
        code: 200,
        message: "added",
        data: query
    })
})

module.exports = router;