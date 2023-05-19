const express = require('express');
const router = express.Router();
const {uploadBird} = require("../controllers/creatbird");

const { uploadBird } = require("../controllers/creatbird");
const { fetchBirdURI } = require("../controllers/identifier");
const fs = require('fs');
const path = require('path');

/**,
 * @swagger
 * /add:
 *    post:
 *      tags:
 *      - add sighting birds record
 *      summary: add sighting birds record
 *      produces:
 *      - application/json
 *     parameters:
 *      - identification: identification
 *        location: location
 *        latitude: latitude
 *        picture: picture
 *        description: description
 *        witnesses: witnesses
 *        code: code
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/logout
 * */

router.post('/add', uploadBird);

// router.post('/identifier', (req, res, next) => {
//     const query = saveBirdSighting({
//         body: req.bodxy,
//     });
//     res.send({
//         code: 200,
//         message: "added",
//         data: query
//     })
// })
router.post('/identifier', async(req, res) => {
    const { description, location } = req.body;

    try {
        const birdURI = await fetchBirdURI(identification);
        res.send({
            code: 200,
            message: "added",
            data: { birdURI }
        });
    } catch (error) {
        console.error("Error identifying bird:", error);
        res.status(500).json({ error: 'Failed to identify bird' });
    }
});

router.get('/bird_list', async(req, res) => {
    try {
        //gets your app's root path
        const root = path.dirname(require.main.filename)

        // joins uploaded file path with root. replace filename with your input field name
        const absolutePath = path.join(root, "../public/res/bird_list.json")

        const obj = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
        res.send({
            code: 200,
            message: "added",
            data: {...obj }
        });
    } catch (error) {
        console.error("Error identifying bird:", error);
        res.status(500).json({ error: 'Failed to identify bird' });
    }
});

module.exports = router;
