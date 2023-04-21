const Bird = require('../models/bird');

const findSightingPage = async (req, res, next) => {
    const body = req.query;
    let nickname = req.session.nickname
    let pageNum = 1;
    if (req.query.pageNum != undefined) {
        pageNum = req.query.pageNum;
    }

    for (const bodyKey in body) {
        if (body[bodyKey] === '') {
            delete body[bodyKey];
        }
        if (body[bodyKey] === 'pageNum') {
            delete body[bodyKey];
        }
        console.log('bodyKey: ' + bodyKey)
        console.log('body[bodyKey]: ' + body[bodyKey])
    }

    //max data in one page
    let pageSize = 10;
    //get data
    let count = await Bird.schema.static.totalCount(body);
    //page Number
    let total = Math.ceil(count / pageSize);

    await Bird.schema.static.findSightingPage(body, pageNum, pageSize)
        .then((doc) => {
            const birds = doc
            res.render('sighting_page', {
                nickname: nickname, birds: birds, page: pageNum, total: total,
            });
        });
};


module.exports = {
    findSightingPage: findSightingPage
};
