const router = require('express').Router();
const verify = require('./verifyToken');
const Local = require('../model/local');

// Get all Locals
router.get('/', async (req, res) => {
    const locals = await Local.find();
    res.json(locals);
});

// Get locals by city
router.get('/city/:localCity', async (req, res) => {
    const locals = await Local.find({ localCity: req.params.localCity });
    res.json(locals);
});

// Get one local by id
router.get('/id/:local_id', async (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId; 
    const local = await Local.find({ _id: ObjectId(req.params.local_id) })
    res.json(local);
});


module.exports = router