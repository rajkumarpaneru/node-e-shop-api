const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const productList = await Product.find().select('name image -_id');

    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})

router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);
})

router.post(`/`, async(req, res) =>{
    const category = await Category.findById(req.body.category);

    if(!category){
        return res.status(400).send('Invalid category');
    }

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription, 
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    cratedProduct = await product.save();

    if(!cratedProduct){
        return res.status(500).send('Error while creating product.')
    }

    res.send(cratedProduct);
});

router.put(`/:id`, async (req, res) => {

    const category = await Category.findById(req.body.category);

    if(!category){
        return res.status(400).send('Invalid category');
    }

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription, 
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {new: true}
    )

    if(!product)
        res.status(500).send('Error while updating product');
    
        res.status(201).json(product);
});

module.exports =router;