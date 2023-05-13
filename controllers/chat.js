const Chat = require('../models/chat');
const {format} = require("morgan");

const insert = async (req, res, next) => {
    const body = req.body;
    let time = body.time;
    let chat_room = body.chat_room;
    let user = body.user;
    let chat_text = body.chat_text;
    console.log('chat_room: ', chat_room)
    Chat.schema.static.insert(time, chat_room, user, chat_text)
        .then((doc) => {
        });
    res.status(200).json({ message: 'success' });
};

const fetchChatRecordList = async (req, res, next) => {
    const body = req.query;
    console.log("body ", body)
    await Chat.schema.static.fetchChatRecordList(body)
        .then((doc) => {
            const chat = doc
            res.status(200).json({ chat: chat });
        });
};

module.exports = {
    insert: insert,
    fetchChatRecordList: fetchChatRecordList
};
