const mongoose = require('mongoose');
const config = require('../config/default.js');

mongoose.connect(config.mongodb , { useNewUrlParser: true })

const Schema = mongoose.Schema;

/**
 * schema of chat record
 * @type {module:mongoose.Schema<Document, Model<Document, any, any>, undefined, {}>}
 */
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

/**
 * insert hte chat record
 *
 * @param time
 * @param chat_room
 * @param user
 * @param chat_text
 * @returns {Promise<unknown>}
 */
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

/**
 * fetch chat record by query param
 *
 * @param findArgs
 * @returns {Promise<unknown>}
 */
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
