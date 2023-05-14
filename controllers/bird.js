const Bird = require('../models/bird');
const {format} = require("morgan");

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
            res.render('index', {
                title: 'Search', nickname: nickname, birds: birds, page: pageNum, total: total, Witnesses: body.Witnesses,identification:body.identification
            });
        });
};

const fetchRecords = async (req, res, next) => {
    const body = req.query;
    let nickname = req.session.nickname
    let pageNum = 1;
    if (req.query.pageNum != undefined) {
        pageNum = req.query.pageNum;
        console.log("pageNum",pageNum)
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
        console.log('bodyKeyaaaa: ' + bodyKey)
        // console.log('body[bodyKey]: ' + body[bodyKey])
    }
    //max data in one page
    let pageSize = 10;
    if (req.query.pageSize != undefined) {
        pageSize = parseInt(req.query.pageSize);
    }
    //get data
    let count = await Bird.schema.static.totalCount(body);
    //page Number
    let total = Math.ceil(count / pageSize);


    let input_field=""
    let identifier_type=""
    if (body.input_field) {
        input_field = body.input_field;
        identifier_type = body.identifier_type;
        if (identifier_type === 'witnesses') {
            body['witnesses'] = input_field;
            console.log("witnesses", body['witnesses'])
            delete body['identification'];
        } else {
            console.log('identification', body['identification'])
            body['identification'] = input_field;
            delete body['witnesses'];
        }
    }

    console.log('body: ', body)
    console.log('pageNum',pageNum)

    await Bird.schema.static.fetchSightingWithPage(body, pageNum, pageSize)
        .then((doc) => {
            const birds = doc
            res.render('index', {
                title:'Records', menuId:'home', nickname: nickname, birds: birds, page: pageNum || 1, total: total, witnesses: body.witnesses, identification:body.identification,
                input_field, identifier_type,
            });
        });
};

const searchRecords = async (req, res, next) => {
    const body = req.query;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime || new Date(8640000000000000);
    let nickname = req.session.nickname
    let pageNum = 1;
    if (req.query.pageNum != undefined) {
        pageNum = req.query.pageNum;
        console.log("pageNum",pageNum)
    }
    for (const bodyKey in body) {
        if (body[bodyKey] === '') {
            delete body[bodyKey];
        }
        if (bodyKey === 'pageNum') {
            delete body[bodyKey];
        }
        if (bodyKey === 'startTime' || bodyKey === 'endTime') {
            const timeRange = {};
            if (startTime) {
                timeRange.$gte = new Date(startTime);
                delete body.startTime;
            }
            if (endTime) {
                timeRange.$lte = new Date(endTime);
                delete body.endTime;
            }
            if (Object.keys(timeRange).length > 0) {
                body.time = timeRange;
            }
        }

        console.log('bodyKeyaaaa: ' + bodyKey)
        // console.log('body[bodyKey]: ' + body[bodyKey])
    }
    //max data in one page
    let input_field=""
    let identifier_type=""
    if (body.input_field) {
        input_field = body.input_field;
        identifier_type = body.identifier_type;
        if (identifier_type === 'witnesses') {
            body['witnesses'] = input_field;
            console.log("witnesses", body['witnesses'])
            delete body['identification'];
        } else {
            console.log('identification', body['identification'])
            body['identification'] = input_field;
            delete body['witnesses'];
        }
    }
    console.log('body111: ', body)
    console.log('pageNum111',pageNum)
    //make sure these values transfer to the front end
    let inputField=body.input_field
    let identifierType=body.identifier_type
    //Delete key-value queues that are not required for database queries
    delete body.input_field
    delete body.identifier_type

    let pageSize = 10;
    if (req.query.pageSize != undefined) {
        pageSize = parseInt(req.query.pageSize);
    }
    //get data
    let count = await Bird.schema.static.totalCount(body);
    //page Number
    let total = Math.ceil(count / pageSize);

    await Bird.schema.static.fetchSightingWithPage(body, pageNum, pageSize)
        .then((doc) => {
            console.log('aaaa',body)
            const birds = doc
            // var timeStr =  format(doc.time, "dd-MM-yyyy hh:mm:ss");
            // birds.timeStr = timeStr
            res.render('sighting_page', {
                title:'Records', menuId:'home', nickname: nickname, birds: birds, page: pageNum || 1, total: total, witnesses: body.witnesses, identification:body.identification,
                input_field:inputField, identifier_type:identifierType,startTime: startTime,endTime: endTime
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
            var timeStr =  format(doc.time, "dd-MM-yyyy hh:mm:ss");
            bird.timeStr = timeStr
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
    findRecordById: findRecordById,
    searchRecords:searchRecords
};
