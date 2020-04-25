const router = require("express").Router();
const User = require('../model/user');
const { registerValidation } = require('../validation')
// Validation
const Joi = require('@hapi/joi')
const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});


router.post('/register', async (req, res) => {

    // validate before creating the user
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if user already in the DB
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send('Email already exists')
     
    // create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password 
    });
    
    // Save to DB
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err) {
        res.status(400).send(err);
    }
})

// router.post('/login', (req, res) => {
//     res.send('Login');
// })



module.exports = router