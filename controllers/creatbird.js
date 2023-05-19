const path = require('path');
const formidable = require('formidable');
const Bird = require('../models/bird');
const fetch = require('node-fetch');

const uploadBird = (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../', 'public', 'uploads');

    console.log(form.uploadDir )
    form.keepExtensions = false;
    form.parse(req, async (err, fields, files) => {
        // res.send(files.picture.filepath.split('public')[1])
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to parse form data' });
        }

        let latitude, longitude;
        try {
            [latitude, longitude] = fields.location.split(",");
            latitude = latitude.trim();
            longitude = longitude.trim();
        } catch (err) {
            console.log(err);
            latitude = null;
            longitude = null;
        }

        Bird.create({
            time: fields.time,
            identification: fields.identification,
            location: fields.location,
            latitude: latitude,
            longitude: longitude,
            picture: files.picture.filepath.split('public')[1],
            description: fields.description,
            witnesses: req.session.nickname,
            code:fields.code,
        }, (err, bird) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Failed to create bird record' });
            }
        });
        res.redirect('/record');
    });
};

module.exports = { uploadBird: uploadBird };
