const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(config.mongodb , { useNewUrlParser: true })

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname: String
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = {
    mongoose,
    userSchema,
    User
};
