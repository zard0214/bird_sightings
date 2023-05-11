const path = require('path');
const formidable = require('formidable');
const Bird  =  require('../models/bird');


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
        Bird.create({
            time: fields.time,
            identification: fields.identification,
            location: fields.location,
            latitude: fields.latitude,
            longitude: fields.longitude,
            picture: files.picture.filepath.split('public')[1],
            description: fields.description,
            witnesses: req.session.nickname,

        }

        , (err, bird) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Failed to create bird record' });
            }

        });res.redirect('/record')

    });
};

module.exports = { uploadBird: uploadBird };
