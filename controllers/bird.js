const Bird = require('../models/bird');

const fetchSightingWithPage = async (req, res, next) => {
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
        if (bodyKey === 'pageNum') {
            delete body[bodyKey];
        }
        if (bodyKey === 'startTime' || bodyKey === 'endTime') {
            // body.
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

    await Bird.schema.static.fetchSightingWithPage(body, pageNum, pageSize)
        .then((doc) => {
            const birds = doc
            res.render('sighting_page', {
                title: 'Bird Sightings List', nickname: nickname, birds: birds, page: pageNum, total: total, Witnesses: body.Witnesses,
            });
        });
};

const fetchRecords = async (req, res, next) => {
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
        if (bodyKey === 'pageNum') {
            delete body[bodyKey];
        }
        if (bodyKey === 'startTime' || bodyKey === 'endTime') {
            // body.
            // delete body[bodyKey];
            if(bodyKey === 'startTime') {
                // body.query().set('time', '$gt: ' + body[bodyKey])
            }
            if(bodyKey === 'endTime') {
                // body.query().set('time', '$lt: ' + body[bodyKey])
            }
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

    await Bird.schema.static.fetchSightingWithPage(body, pageNum, pageSize)
        .then((doc) => {
            const birds = doc
            res.render('index', {
                    title:'Records', menuId:'home', nickname: nickname, birds: birds, page: pageNum, total: total, witnesses: body.witnesses,
            });
        });
};

const findRecordById = async (req, res, next) => {
    const body = req.query;
    let nickname = req.session.nickname
    let _id = 1;
    if (req.query._id != undefined) {
        _id = req.query._id;
    }
    for (const bodyKey in body) {
        if (body[bodyKey] === '') {
            delete body[bodyKey];
        }
        console.log('bodyKey: ' + bodyKey)
        console.log('body[bodyKey]: ' + body[bodyKey])
    }
    await Bird.schema.static.findRecordById(body)
        .then((doc) => {
            const bird = doc
            console.log('birdSchema.static.findRecordById: ' + doc)
            console.log('nickname: ' + nickname)
            res.render('detail', {
                title:'Record Detail', menuId:'home', bird: bird, nickname: nickname,
            });
        });
};


module.exports = {
    fetchSightingWithPage: fetchSightingWithPage,
    fetchRecords: fetchRecords,
    findRecordById: findRecordById
};
