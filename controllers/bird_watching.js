var bodyParser = require("body-parser");
//var req = require('request');
var Records = require('../models/records');
var path = require('path');


exports.create = function (req, res) {
    var userData = req.body;
    var records = new Records({
        first_name: userData.firstname,
        family_name: userData.lastname,
        dob: userData.year
    });

    records.save(function (err, results) {
        if (err)
            res.status(500).send('Invalid data!');
    //ntent-Type', 'application/json');
       // res.send(JSON.stringify(character));
        res.json({records: records});
    });
};






