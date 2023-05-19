const Bird = require('../models/bird');
const {format} = require("morgan");
const formidable = require("formidable");

const fetchSightingWithPage = async (req, res, next) => {
    const body = req.query;
    let nickname = req.session.nickname;
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
                title: 'Search', menuId:'home',nickname: nickname, birds: birds, page: pageNum, total: total, Witnesses: body.Witnesses,identification:body.identification
            });
        });
};
const sortBirds = async (req, res, next) => {
    try {
        const sort = req.query.sort;
        let nickname = req.session.nickname;
        let pageNum = req.query.pageNum || 1;
        let pageSize = 10;

        // Retrieve bird data from the database
        let birds = await Bird.schema.sortByTime(req.query, pageNum, pageSize);

        // Get the total number of pages
        let totalCount = await Bird.schema.static.totalCount(req.query);
        let totalPage = Math.ceil(totalCount / pageSize);

        // Sort the bird data based on the specified sort parameter
        if (sort === 'time_1') {
            birds = await Bird.sortByTime('asc', pageNum, pageSize);
        } else if (sort === 'time_-1') {
            birds = await Bird.sortByTime('desc', pageNum, pageSize);
        } else {
            birds = await Bird.sortByTime('asc', pageNum, pageSize); // 默认排序方式
        }

        res.render('index', {
            title: 'Bird Sightings',
            menuId: 'sort',
            nickname: nickname,
            birds: birds,
            page: pageNum,
            total: totalPage
        });
    } catch (error) {
        // 处理错误
        console.error(error);
        // 返回错误页面或其他逻辑
        res.render('error', {
            title: 'Error',
            error: error
        });
    }
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
                title:' detail', menuId:'home', bird: bird, nickname: nickname,
            });
        });
};
const findNearbyBirds = async (req, res, next) => {
    const form = formidable({ multiples: true });

    try {
        const { fields } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ fields, files });
            });
        });

        const latitude = fields.latitude;
        const longitude = fields.longitude;
        const distance = fields.distance;
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Distance:", distance);


        const allBirds = await Bird.find();


        const nearbyBirds = allBirds.filter(bird => {
            const birdLatitude = bird.latitude;
            const birdLongitude = bird.longitude;
            const birdDistance = calculateDistance(latitude, longitude, birdLatitude, birdLongitude);

            return birdDistance <= distance;
        });

        const birdData = nearbyBirds.map(bird => ({
            identification: bird.identification,
            latitude: bird.latitude,
            longitude: bird.longitude,
            picture: bird.picture,
            description: bird.description,
        }));

        res.json(birdData);
        console.log("Bird Data:", birdData);
    } catch (error) {
        console.log("Error:", error);
        res.redirect("/");
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the earth in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
}

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
const changeIdentification = async (req, res, next) => {
    body = req.body;
    console.log("1", body);
    identification = body.identificationValue;
    id = body.id;
    code = body.codeValue;
    console.log(id, identification, code);

    try {
        const updatedBird = await Bird.updateIdentificationById(id, identification, code);
        console.log(updatedBird);
        res.json({ success: true, bird: updatedBird }); // Send success response with the updated bird
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: 'An error occurred. Please try again.' }); // Send error response with the error message
    }
};



module.exports = {
    fetchSightingWithPage: fetchSightingWithPage,
    // sortBirds:sortBirds,
    findRecordById: findRecordById,
    searchRecords:searchRecords,
    findNearbyBirds: findNearbyBirds,
    changeIdentification:changeIdentification,
};
