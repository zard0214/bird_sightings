const mongoose = require('mongoose');
const config = require('../config/default');

mongoose.connect(config.mongodb , { useNewUrlParser: true })

const birdSchema = new mongoose.Schema({
    Time: String,
    Identification:String,
    location:String,
    Witnesses: {
        type: String,
        ref: 'users'
    }

}, {
    timestamps: true
});

birdSchema.static.findSightingPage =
    function(findArgs = {},
             pageNum = 1,
             pageSize = 10) {
        console.log('findArgs: ' + findArgs)
        console.log('pageNum: ' + pageNum)
        console.log('pageSize: ' + pageSize)
        // if(findArgs === undefined || findArgs.)
        // for (const bodyKey in findArgs) {
        //     console.log('bodyKey: ' + bodyKey)
        //     console.log('body[bodyKey]: ' + findArgs[bodyKey])
        // }
        return new Promise((resolve, reject) => {
            const skipNum = (pageNum - 1) * pageSize;
            console.log('skipNum: ' + skipNum)
            Bird.find({})
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

const Bird = mongoose.model('birds', birdSchema);

module.exports = Bird;
