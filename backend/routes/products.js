const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

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

   if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send('Invalid product id');
   }

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

router.delete(`/:id`, async (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product => {
        if(product){
            return res.status(200).json({success: true, message: 'Product is deleted.'});
        } else {
            return res.status(404).json({success: false, message: 'Product not found'})
        }
    })
    .catch(err => {
        return res.status(400).json({success:false, error: err});
    });
});

router.get('/count', async(req, res)=>{
    const productCount = await Product.countDocuments((count)=> count);

    if(!productCount){
        res.status(500).json({success: false});
    }

    res.send(productCount);
});

router.get('/featured/:count', async(req, res)=>{
    const count = req.params.count ? req.params.count : 0;
    const featuredProducts = await Product.find({isFeatured: true}).limit(+count)

    if(!featuredProducts){
        res.status(500).json({success: false});
    }
    
    res.send(featuredProducts);
});


module.exports =router;