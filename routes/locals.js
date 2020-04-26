const router = require('express').Router();
const verify = require('./verifyToken');
const Local = require('../model/local');
const LocalPreview = require('../model/localPreview');
const localHelper = require('../helpers/localHelper')

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
    const local = await Local.find({ _id: ObjectId(req.params.local_id) });
    res.json(local);
});

router.put('/id/:local_id/update', verify, async (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId; 
    localUpdated = req.body;
    if(localHelper.localProfileIsComplete(localUpdated)) { localUpdated.profile_isComplete = true };
    savedLocal = await Local.updateOne({ _id: ObjectId(req.params.local_id) },localUpdated);

    // If the profile is complete (we want it to appear in the Locals list as preview), we update it or create it if not exist.
    if (localUpdated.profile_isComplete) {
        const localPreview = {
            local_id: localUpdated._id,
            name: localUpdated.name,
            localCity: localUpdated.localCity,
            hourlyRate: localUpdated.hourlyRate,
            quote: localUpdated.quote,
        };

        const savedLocalPreview = await LocalPreview.findOneAndUpdate({local_id: localUpdated._id}, localPreview, { 
            upsert: true, // If the record doesn't exist it will be created
            new: true
        });
    }
    res.send("Local Updated");
});

module.exports = router