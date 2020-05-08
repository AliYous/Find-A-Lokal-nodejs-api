const router = require('express').Router();
require('dotenv').config();
const verify = require('./verifyToken');
const Local = require('../model/local');
const LocalPreview = require('../model/localPreview');
const localHelper = require('../helpers/localHelper');

// Multer (accept images in the requests)
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

// Cloudinary (image upload)
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
  cloud_name: 'dnidiwifa', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:  process.env.CLOUDINARY_API_SECRET 
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
    var localUpdated = JSON.parse(req.body.localData);

    // Save the image to cloudinary then assign the img url to the local.localImage, if no image, then just save the user data
    if(req.file) {
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
            if(err) {res.send(err)}
            localUpdated.localImage = result.url; //Adding the image to the local
            const savedLocal = await Local.updateOne({ _id: ObjectId(req.params.local_id) },localUpdated);
            const localPreview = {
                local_id: localUpdated._id,
                name: localUpdated.name,
                localCity: localUpdated.localCity,
                hourlyRate: localUpdated.hourlyRate,
                quote: localUpdated.quote,
                localImage: localUpdated.localImage,
            };
    
            const savedLocalPreview = await LocalPreview.findOneAndUpdate({local_id: localUpdated._id}, localPreview, { 
                upsert: true, // If the record doesn't exist it will be created
                new: true
            });
            res.send('local & preview Updated');

        })
    } else { 
        const savedLocal = await Local.updateOne({ _id: ObjectId(req.params.local_id) },localUpdated); 
        const localPreview = {
            local_id: localUpdated._id,
            name: localUpdated.name,
            localCity: localUpdated.localCity,
            hourlyRate: localUpdated.hourlyRate,
            quote: localUpdated.quote,
            localImage: localUpdated.localImage,
        };

        const savedLocalPreview = await LocalPreview.findOneAndUpdate({local_id: localUpdated._id}, localPreview, { 
            upsert: true, // If the record doesn't exist it will be created
            new: true
        });
        res.send('local & preview Updated');

    }
});

// Add review to local and update avgRating + numberOfReviews
router.put('/id/:local_id/reviews/update', async (req, res) => {
    var ObjectId = require('mongoose').Types.ObjectId; 
    const reqBody = JSON.parse(JSON.stringify(req.body));

    const review = {
        reviewerId: reqBody.reviewerId,
        reviewerName: reqBody.reviewerName,
        rating: reqBody.rating,
        reviewText: reqBody.reviewText
    }
    let local = await Local.findById(ObjectId(req.params.local_id));
    let localPreview = await LocalPreview.findOne({local_id: req.params.local_id});
  

    local.reviews.push(review);

    local.numberOfReviews = local.reviews.length;
    localPreview.numberOfReviews = local.reviews.length;

    let total = 0;
    local.reviews.forEach(review => {
        if(review.rating) {
            total += review.rating;
            console.log(total);        
        }
    });

    local.avgRating = total/local.reviews.length;
    localPreview.avgRating = total/local.reviews.length;


    const updatedLocalPreview = await LocalPreview.findOneAndUpdate({ local_id: req.params.local_id}, localPreview);
    
    try {
        const updatedLocal = await Local.updateOne({ _id: ObjectId(req.params.local_id) },local); 
        res.send("local reviews updated : " + JSON.stringify(updatedLocal.reviews));
    } catch(err) {
        res.send(err);
    }

});


module.exports = router