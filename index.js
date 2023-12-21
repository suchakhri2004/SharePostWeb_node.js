const express = require('express');
const { request } = require('http');
const hbs = require('hbs');
const app = express();
const generalRouter = require('./routers/general')
const postRouter = require('./routers/post')

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/',generalRouter);
app.use('/p',postRouter);



app.listen(1402, () =>{
    console.log('server http://localhost:1402');
});
