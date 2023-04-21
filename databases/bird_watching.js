const config = require('../config/config');
const mongoose = require("mongoose");

mongoose.connect(config.mongodb , { useNewUrlParser: true })

mongoose.Promise = global.Promise;

mongoose.connect(mongoDB);

var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//  MORE GENERAL WAY WOULD BE TO CALL:
// try {
//     var connection = mongoose.createConnection(mongoDB);
//     console.log("connection to mongodb worked!");
// }catch (e) {
// console.log('error in db connection: ' +e.message)
// }
//
// WHICH WOULD ALLOW MULTIPLE CONNECTIONS


