const mongoose = require('mongoose');
const { userSchema } = require('./users.js');

mongoose.connect('mongodb://127.0.0.1/Bird' , { useNewUrlParser: true }).then(() => {
    console.log("连接成功");
}).catch((err) => {
    console.log("err");
});

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
//         Identification: 'UNKONW',
//         location: 'Central Park',
//         Witnesses:User.nickname="JIE",
//     });
//     bird.save();
// }
module.exports = {
    mongoose,
    birdSchema,
    User,
    Bird
};
