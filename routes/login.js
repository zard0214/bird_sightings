var express = require('express');
var router = express.Router();

let {User}=require("../databases/index")

router.get('/', (req, res) => {
    res.render('login', { title: 'My Bird Login' });
});
/* GET users listing. */
router.post('/', function(req, res, next) {
    try {
        let nickname = req.body.nickname;
        console.log(req.body)
        if (!nickname) {
            return res.status(400).json({
                success: false,
                message: 'Username are required fields',
            });

        } else {

            User.create(req.body).then((r) => {
                console.log(req.body);
                res.json({
                    code: 1,
                    msg: "登陆成功",
                })
            })

        }

    }catch (err) {
        // If there's an error, return an error message and log the error to the console
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }});
module.exports = router
