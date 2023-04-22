const User = require('../models/user');

/**
 * user logout function
 * @param req
 * @param res
 */
function login(req, res) {
    try {
        let nickname = req.body.nickname;
        if (!nickname) {
            return res.status(400).json({
                success: false,
                message: 'Username are required fields',
            });
        }else{
            req.session.nickname = nickname;
            res.redirect('/sighting/fetchSightingWithPage');
        }
    } catch (err) {
        // If there's an error, return an error message and log the error to the console
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        })
    }
}


/**
 * user logout function
 * @param req
 * @param res
 */
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
}

module.exports = {
    login: login,
    logout: logout,
};
