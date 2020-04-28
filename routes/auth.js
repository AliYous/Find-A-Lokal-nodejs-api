const router = require("express").Router();
const User = require('../model/user');
const Local = require('../model/local');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verify = require('./verifyToken');
const { registerValidation, loginValidation } = require('../validation');


router.post('/register', async (req, res) => {

    // validate before creating the user
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if email exists
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('This Email already exists');

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    // create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isLocal: req.body.isLocal
    });
    
    // Save to DB
    try {
        const savedUser = await user.save();
        // Create a document for this user in locals collection
        if (user.isLocal) {
            const local = new Local({
                user_id: savedUser._id,
                name: savedUser.name
            })
            const savedLocal = await local.save()
            res.send({ user: savedUser._id, local: savedLocal._id});
        }else {
            res.send({ user: savedUser._id });
        }
    }catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {

    // validation
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    // email exists ?
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('No account is linked to that email');
    // Password is correct ?
    const validPass = await bcrypt.compare(req.body.password, user.password); // Compares user.password with the hashed password from the db
    if (!validPass) return res.status(400).send('Invalid Password');

    // Create and assign a jwt token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({token: token, user: user});
});

// Update user by id
router.put('/edit/:user_id', verify, async (req, res) => {
    const user = await User.findById(req.params._id);
    if (user) {
        const updatedUser = req.body;
        const savedUser = await User.updateOne({ _id: ObjectId(req.params.user_id) }, updatedUser);
        res.send(savedUser);
    } else {
        res.send('no user attahced to the queried _id')
    }
});



module.exports = router