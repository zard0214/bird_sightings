const User = require('../models/user');

/**
 * User login function
 * @param req
 * @param res
 */
function login(req, res) {
    try {
        let nickname = req.body.nickname;
        if (!nickname) {
            return res.status(400).json({
                success: false,
                message: 'Username is a required field',
            });
        } else {
            User.create({ nickname: nickname })
                .then(createdUser => {
                    console.log('New user created:', createdUser);
                    // Store the user ID (_id) in the session
                    req.session.nickname = nickname;
                    res.redirect('/record');
                })
                .catch(error => {
                    console.error('Error creating user:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                    });
                });
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
 * User logout function
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
