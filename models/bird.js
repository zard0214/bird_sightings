const mongoose = require('mongoose');
const config = require('../config/default.js');

mongoose.connect(config.mongodb , { useNewUrlParser: true })

const Schema = mongoose.Schema;

const birdSchema = new Schema({
    time: Date,
    identification: String,
    location: String,
    latitude: Number,
    longitude: Number,
    picture: String,
    description: String,
    witnesses: {
        type: String,
        ref: 'users'
    }
}, {
    timestamps: true
});

birdSchema.static.totalCount = function (findArgs) {
    return new Promise(async (resolve, reject) => {
        await Bird.countDocuments(findArgs)
            .then((num) => {
                console.log('num: ' + num)
                resolve(num);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

birdSchema.static.fetchSightingWithPage =
    function(findArgs = {},
             pageNum = 1,
             pageSize = 10) {
        // console.log('findArgs: ' + findArgs)
        // console.log('pageNum: ' + pageNum)
        // console.log('pageSize: ' + pageSize)
        // if(findArgs === undefined || findArgs.)
        for (const bodyKey in findArgs) {
            console.log('findArgs11: ' + bodyKey)
            console.log('findArgs[bodyKey]22: ' + findArgs[bodyKey])
        }
        return new Promise(async (resolve, reject) => {
            const skipNum = (pageNum - 1) * pageSize;
            // console.log('skipNum: ' + skipNum)
            await Bird.find(findArgs)
                // .sort({updateTime: -1})
                .limit(pageSize)
                .skip(skipNum)
                .exec()
                .then((doc) => {
                    resolve(doc);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    };

birdSchema.static.findRecordById =
    function(findArgs = {}) {
        return new Promise(async (resolve, reject) => {
            await Bird.find(findArgs)
                .exec()
                .then((doc) => {
                    resolve(doc);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    };

const Bird = mongoose.model('birds_record', birdSchema);
// for (let i = 1; i <= 29; i++) {
//     const bird = new Bird({
//         time: new Date(),
//         identification:'unknown',
//         location: 'Central Park',
//         latitude: i,
//         longitude: i,
//         witnesses: "jie" + i,
//     });
//     bird.save();
// }
module.exports = Bird;
