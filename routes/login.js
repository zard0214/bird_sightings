var express = require('express');
var router = express.Router();

let {User}=require("../databases/index")

router.get('/', (req, res) => {
    res.redirect('login');
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'My Bird Login' });
});

/**,
 * @swagger
 * /: #
 *    post:
 *      tags: #login
 *      - index
 *      summary: login
 *      produces:
 *      - application/json
 *      parameters:
 *      - parameter 1: nickname
 *      responses:
 *        200:
 *          description: successful operation
 *        505:
 *          description: service error
 * */
router.post('/login', function(req, res, next) {
    try {
        let nickname = req.body.nickname;
        console.log(req.body)
        if (!nickname) {
            return res.status(400).json({
                success: false,
                message: 'Username are required fields',
            });
        } else
            User.create(req.body).then((r) => {
                res.redirect('/chat');
            });
    } catch (err) {
        // If there's an error, return an error message and log the error to the console
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }});

module.exports = router
