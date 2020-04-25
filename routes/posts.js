const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/user');

// We add the verify middleware to the route to make sure that the auth-token is present if the route is private
router.get('/', verify, (req, res) => {
    // User.findOne({_id: req.user}); // Because the auth-token contains the user_is, we can access user data this way.

    res.json({
        posts: {
            title: 'my first post',
            description: 'some confidential shit'
        }
    });
});

module.exports = router