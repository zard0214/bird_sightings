const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/bird_watching').then(() => {
    console.log("success");
}).catch((err) => {
    console.log("err");
});

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
