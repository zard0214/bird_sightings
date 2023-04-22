var express = require('express');
var router = express.Router();
const session = require('express-session');
const User = require('../controllers/user');

router.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.get('/', (req, res) => {
    res.redirect('login');
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'My Bird Login' });
});

/**,
 * @swagger
 * /login:
 *    post:
 *      tags:
 *      - login
 *      summary: login
 *      produces:
 *      - application/json
 *      parameters:
 *      - nickname: nickname
 *        in: query
 *        description: nickname
 *        required: false
 *        type: integer
 *        maximum:
 *        minimum: 1
 *        format:
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/login
 *        400:
 *          description: Username are required fields
 *        500:
 *          description: Internal server error
 * */
router.post('/login', User.login);

router.post('/logout', User.logout);

module.exports = router
