var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RecordsSchema = new Schema(
    {
        description: {type: String, required: true, max: 500},
        dateTime: {type: Date, required: true, max: 100},
        latitude: {type: Number, required: true, max: 100},
        longitude: {type: Number, required: true, max: 100},
        // nickName: {type: String, required: true, max: 100},
        userId: {type: String, required: true, max: 15},
    }
);


RecordsSchema.set('toObject', {getters: true, virtuals: true});

var Records = mongoose.model('Records', RecordsSchema);

module.exports = Records;
