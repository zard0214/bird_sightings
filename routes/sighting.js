const express = require('express');
let { Bird } = require('../databases/bird');

const router = express.Router();

router.get('/', async (req, res) => {
    const nickname = req.session.nickname; // access nickname value from session
    //get page
    let page = req.query.page;
    //max data in one page
    let pagesize = 10;
    //get data
    let count = await Bird.countDocuments({});
    //pagenumber
    let total = Math.ceil(count / pagesize);

    let start = (page - 1) * pagesize;

    let birds = await Bird.find({}).limit(pagesize).skip(start);

    res.render('sightings', { nickname, birds, page, total });
});

module.exports = router;

