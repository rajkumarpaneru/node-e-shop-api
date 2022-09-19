const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.send(categoryList);
});

router.post(`/`, async (req, res) =>{
    const category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })

    createdCategory = await category.save();
    if(!createdCategory)
        res.status(500).json({
        error: err,
        success: false
        });
    
        res.status(201).json(createdCategory);
});

module.exports =router;