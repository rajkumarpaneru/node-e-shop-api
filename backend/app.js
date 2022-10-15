const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler')
require('dotenv/config');

app.use(cors());
app.options('*', cors);

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt);
app.use('public/uploads', express.static(__dirname + 'public/uploads'));
// app.use(errorHandler);
app.use((err, req, res, next) => {
    if(err){
        res.status(500).json({message: 'Error in the server'});
    }
});


const productsRoutes = require('./routes/products');

const categoriesRoutes = require('./routes/categories');

const usersRoutes = require('./routes/users');

const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`/products`, productsRoutes);
app.use(`/categories`, categoriesRoutes);
app.use(`/users`,usersRoutes);
app.use(`/orders`,ordersRoutes);

//Database
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