const express = require('express');
const router = express.Router();
const { uploadBird } = require("../controllers/creatbird");
const { fetchBirdURI } = require("../controllers/identifier");
const fs = require('fs');
const path = require('path');
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

// router.get('/identifier', async function(req, res, next) {

//     const query = await saveBirdSighting(req.body);
//     //const birds = []; // Rep
//     let sight_id = req.params.id;
//     console.log("/identifier/" + sight_id)
//     const birdInfo = query.data;
//     res.send({
//             code: 200,
//             message: "added",
//             data: birdInfo
//         })
//         // res.render('identifier', {
//         //     // record: recordData,
//         //     birdInfo: birdInfo,
//         //     // messages: messages,
//         //     id: sight_id,
//         //         
//         // }    );
// });