const Bird = require('../models/bird');

// const findSightingPage = (req, res, next) => {
//     let nickname = req.session.nickname
//     //get page
//     let page = 1;
//     if(req.query.page != undefined){
//         page = req.query.page;
//     }
//     //max data in one page
//     let pagesize = 10;
//     //get data
//     let count = 100;
//     console.log('count: ' + count)
//     //pagenumber
//     let total = Math.ceil(count / pagesize);
//     console.log('total: ' + total)
//     let start = (page - 1) * pagesize;
//
//     Bird
//         .find()
//         .limit(pagesize)
//         .skip(start)
//         .exec().then((result) => {
//         const birds = result
//         res.render('sighting_page', {
//             nickname: nickname, birds: birds, page: page, total: total,
//         });
//     }).catch((err) => {
//         console.log(err);
//     });
// };

const findSightingPage = (req, res, next) => {
    const body = req.query;
    let nickname = req.session.nickname
    let pageNum = 1;
    if(req.query.pageNum != undefined){
        pageNum = req.query.pageNum;
    }
    //max data in one page
    let pageSize = 10;
    //get data
    let count = 100;
    //pageNumber
    let total = Math.ceil(count / pageSize);
    // console.log('body: ' + body)
    // console.log('pageNum: ' + pageNum)
    // console.log('pageSize: ' + pageSize)
    for (const bodyKey in body) {
        if (body[bodyKey] === '') {
            delete body[bodyKey];
        }
        if(body[bodyKey] === 'pageNum'){
            delete body[bodyKey];
        }
        console.log('bodyKey: ' + bodyKey)
        console.log('body[bodyKey]: ' + body[bodyKey])
    }
    Bird.schema.static.findSightingPage(body, pageNum, pageSize)
        .then((doc) => {
            const birds = doc
            res.render('sighting_page', {
                nickname: nickname, birds: birds, page: pageNum, total: total,
            });
        });
};


module.exports = {
    // findSightingPage: findSightingPage,
    findSightingPage: findSightingPage
};
