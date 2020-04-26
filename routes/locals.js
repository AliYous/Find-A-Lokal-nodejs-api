const router = require('express').Router();
const verify = require('./verifyToken');
const Local = require('../model/local');

// Get all Locals
router.get('/', async (req, res) => {
    const locals = await Local.find();
    res.json(locals);
});

// Get locals by city
router.get('/:localCity', async (req, res) => {
    const locals = await Local.find({ localCity: req.params.localCity})
    res.json(locals);
})

// Get one local by id
router.get('/:local_id', async (req, res) => {
    const locals = await Local.findById(req.params._id)
    res.json(locals);
})


module.exports = router