const { User } = require("../models/user");
const router = require("./products");


router.get(`/`, async (req, res)=>{
    const userList = await User.find();

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
        passwordHash: req.body.passwordHash,
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