const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');


//middleware
app.use(bodyParser.json());

app.use(morgan('tiny'));

require('dotenv/config');

const api = process.env.API_URL;


//make schema
const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
});


//make model
const Product = mongoose.model('Product', productSchema);


app.get('/products', (req, res)=> {
    
    const products = Product.find()
    .then((products)=> {
        res.send(products);
    })
    .catch((err)=>{
        res.status(500).json({
            error: err,
            success: false,
        });
    });

    
});

app.post('/products', (req, res)=> {
    // const newProduct = req.body;

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    });

    product.save()
    .then((createdProduct)=>{
        res.status(201).json(createdProduct);
    })
    .catch((err)=>{
        res.status(500).json({
            error: err,
            success: false,
        });
    });

});

mongoose.connect(process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'E-shop'
    })
.then(()=>{
    console.log('Database Connection is Ready ...');
})
.catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{
    console.log(api);
})