const mongoose = require('mongoose');
const config = require('../config/default.js');
const Bird = require("./bird");

mongoose.connect(config.mongodb , { useNewUrlParser: true })

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    time: Date,
    chat_room: String,
    user: {
        type: String,
        ref: 'users'
    },
    chat_text: String,
}, {
    timestamps: true
});

chatSchema.static.insert =
    function(time,
             chat_room,
             user,
             chat_text) {
        return new Promise(async (resolve, reject) => {
            Chat.create({
                    time: time,
                    chat_room: chat_room,
                    user: user,
                    chat_text: chat_text
                }
                , (err, chat) => {
                });
        });
    };

chatSchema.static.fetchChatRecordList =
    function(findArgs = {}) {
        return new Promise(async (resolve, reject) => {
            // console.log('skipNum: ' + skipNum)
            await Chat.find(findArgs)
                // .sort({updateTime: -1})
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

const Chat = mongoose.model('chat_record', chatSchema);

module.exports = Chat;
