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

router.get(`/:id`, async (req, res) =>{
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({success: false})
    } 
    res.send(category);
});

router.put(`/:id`, async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        {new: true}
    )

    if(!category)
        res.status(500).send('Error while updating category');
    
        res.status(201).json(category);
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

router.delete(`/:id`, async (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category => {
        if(category){
            return res.status(200).json({success: true, message: 'Category is deleted.'});
        } else {
            return res.status(404).json({success: false, message: 'Category not found'})
        }
    })
    .catch(err => {
        return res.status(400).json({success:false, error: err});
    });
});

module.exports =router;