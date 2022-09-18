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


app.get('/products', (req, res)=> {
    
    const product = {
        id: 1,
        name: 't-shirt',
        image: 'some_url',
    };
    res.send(product);
});

app.post('/products', (req, res)=> {
    const newProduct = req.body;

    res.send(newProduct);
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