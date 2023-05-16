const express = require('express');
const router = express.Router();
const { uploadBird } = require("../controllers/creatbird");
const { fetchBirdURI } = require("../controllers/identifier");


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
        const birdURI = await fetchBirdURI(location, description);
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