const router = require('express').Router();
const verify = require('./verifyToken');
const Local = require('../model/local');

// Show all Locals
router.get('/', async (req, res) => {
    const locals = await Local.find();
    res.json(locals);
});

// Update a local

module.exports = router