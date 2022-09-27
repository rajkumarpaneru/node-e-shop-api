const { User } = require("../models/user");
const router = require("./products");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { response } = require("express");

router.get(`/`, async (req, res)=>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        return res.status(500).json({success: false})
    }

    res.send(userList);
});


router.post(`/`, async (req, res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        color: req.body.color,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        appartment: req.body.appartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });

    user = await user.save();

    if(!user){
        return res.status(400).send('Error while creating user.');
    }

    return res.send(user);
});

router.get(`/:id`, async(req, res)=>{
   
 const user = await User.findById(req.params.id).select('-passwordHash');
 if(!user){
    res.status(500).json({message: 'The user with given id is not found.'});
 }

 return res.status(200).send(user);

});

router.post('/login', async(req, res) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return response.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        }, 'secret',
        {
            expiresIn: '1w' // '1d' , '1m' 
        });

        res.status(200).send({user: user.email, token: token});
    }else{
        res.status(400).send('Invalid credentials');
    }
    return res.status(200).send(user);
});