var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RecordsSchema = new Schema(
    {
        description: {type: String, required: true, max: 100},
        date_time: {type: String, required: true, max: 100},
        nickname: {type: String, required: true, max: 100},
        latitude: {type: String, required: true, max: 100},
        longitude: {type: String, required: true, max: 100},
        imageurl: {type: String, required: true, max: 100},
    }
);


RecordsSchema.set('toObject', {getters: true, virtuals: true});

var Records = mongoose.model('Records', RecordsSchema);

module.exports = Records;