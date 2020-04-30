const router = require('express').Router();
const verify = require('./verifyToken');
const LocalPreview = require('../model/localPreview');



// Get all Locals
router.get('/', async (req, res) => {
    const locals = await LocalPreview.find();
    res.json(locals);
});

// Get locals by city
router.get('/city/:localCity', async (req, res) => {
    const locals = await LocalPreview.find({ localCity: req.params.localCity });
    res.json(locals);
});

module.exports = router