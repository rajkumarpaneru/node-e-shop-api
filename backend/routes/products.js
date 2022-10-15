const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){
            uploadError = null;
        }
        cb(uploadError, '/public/uploads')
    },
    filename: function(req, file, cb){
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${$extension}`)
    } 
});

const uploadOptions = multer({storage: storage});


router.get(`/`, async (req, res) =>{

    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }
    const productList = await Product.find(filter).populate('category');

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


router.post(`/`, uploadOptions.single('image'), async(req, res) =>{
    const category = await Category.findById(req.body.category);

    if(!category){
        return res.status(400).send('Invalid category');
    }

    const file = req.file;

    if(!file)
        return res.status(400).send('No image in the request.')

    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription, 
        image: `${basePath}${fileName}`,
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

router.put(
    `/gallery-images/:id`,
    uploadOptions.array('images', 10), 
    async(req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).send('Invalid Product Id');
        }
        
        const files = req.files;

        let imagePaths = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        if(files){
            files.map(file => {
                imagePaths.push(`${basePath}${file.fileName}`);
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagePaths,
            },
            {new: true}
        )

        if(!product){
            return res.status(500).send('The product cannot be updated.');
        }

        return res.send(product);
})


module.exports =router;