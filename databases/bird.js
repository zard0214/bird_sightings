const mongoose = require('mongoose');
const config = require('../config/config');
const { userSchema } = require('./users.js');

mongoose.connect(config.mongodb , { useNewUrlParser: true })

const Schema = mongoose.Schema;

const User = mongoose.model('User', userSchema);

const birdSchema = new Schema({
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

const Bird = mongoose.model('Bird', birdSchema);
// for (let i = 1; i <= 10; i++) {
//     const bird = new Bird({
//         Time: '2023-04-13 12:30:00',
//         Identification:'woodpecker',
//         location: 'Central Park',
//         Witnesses:User.nickname="alu",
//     });
//     bird.save();
// }
module.exports = {
    mongoose,
    birdSchema,
    User,
    Bird
};
