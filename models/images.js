var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImagesSchema = new Schema(
    {
        imageurl: {type: String, required: true, max: 100},
        recordid: {type: String, required: true, max: 100},
    }
);


ImagesSchema.set('toObject', {getters: true, virtuals: true});

var Images = mongoose.model('Records', ImagesSchema);

module.exports = Images;