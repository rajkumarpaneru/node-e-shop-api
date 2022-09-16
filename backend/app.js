const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL;


app.get('/', (req, res)=> {
    res.send('hello api');
});
app.listen(3000, ()=>{
    console.log(api);
})