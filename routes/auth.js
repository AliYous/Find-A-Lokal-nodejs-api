const router = require("express").Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
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
        password: hashedPassword
    });
    
    // Save to DB
    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    }catch(err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {

    // validation
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    // email exists ?
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('No account is linked to that email');
    // Password is correct ?
    const validPass = await bcrypt.compare(req.body.password, user.password) // Compares user.password with the hashed password from the db
    console.log("pass " + validPass)
    if (!validPass) return res.status(400).send('Invalid Password')
    res.send('loggedIn')


})



module.exports = router