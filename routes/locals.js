const router = require('express').Router();
const verify = require('./verifyToken');
const Local = require('../model/local');
const LocalPreview = require('../model/localPreview');
const localHelper = require('../helpers/localHelper');

const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './uploads/');
    },
    filename(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

fileFilter = (req, file, callback) => {
if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
} else {
    callback('Only .png or .jpeg accepted', false)
}
}
const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5
    // },
    fileFilter: fileFilter

});


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

// Get one local by local_id
router.get('/id/:local_id', async (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId; 
    console.log(req.params.local_id)
    const local = await Local.find({ _id: ObjectId(req.params.local_id) });
    res.json(local);
});
// Get one local by user_id
router.get('/user_id/:user_id', async (req, res) => {
    const local = await Local.find({ user_id: req.params.user_id });
    res.json(local);
});

//edit local profile
router.put('/id/:local_id/update', upload.single('file'), async (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId; 
    const localUpdated = req.body;
    localUpdated.localImage = req.file.path //Adding the image to the local
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
            localImage: localUpdated.localImage
        };

        const savedLocalPreview = await LocalPreview.findOneAndUpdate({local_id: localUpdated._id}, localPreview, { 
            upsert: true, // If the record doesn't exist it will be created
            new: true
        });
        res.send('local & preview Updated');
    } else {
        res.send("Local Updated");
    }
});

module.exports = router