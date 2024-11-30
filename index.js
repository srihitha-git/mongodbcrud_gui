const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Brand=require('./models/Brand');

const app=express();
const port=3000;

//mongodb connection
mongoose.connect('mongodb://localhost:27017/dbrands')
.then(()=>console.log('connected to mongodb'))
.catch(err=> console.error('error connecting to mongodb',err));

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));//serving static files  like css

//set ejs as the view engine
app.set('view engine','ejs');

//routes
//home page show all brands and the forms for adding a new brand
app.get('/',async(req,res)=>{
    try{
        const brands = await Brand.find();
        res.render('index',{brands});
    }
    catch(err){
        console.log(err);
        res.status(500).send('server error');
    }
})

//add new brand
app.post('/add',async (req,res)=>{
    try{
        const newBrand= new Brand({
            name:req.body.name,
            description: req.body.description
        });
        await newBrand.save();
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('error adding brand');
    }
});

//exit brand page - prepopulate the form with the existing data
app.get('/edit/:id',async(req,res)=>{
    try{
        const brand = await Brand.findById(req.params.id);
        if(!brand) return res.status(404).send('brand not found');
        res.render('edit',{brand});
    }catch(err){
        console.log(err);
        res.status(500).send('server error');
    }
});

//update brand
app.post('/edit/:id',async (req,res)=>{
    try{
        await Brand.findByIdAndUpdate(req.params.id,req.body);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('error updating brand');
    }
});

//delete brand
app.post('/delete/:id',async(req,res)=>{
    try{
        await Brand.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send('error deleting brand');
    }
});
//start the server
app.listen(port,()=>{
    console.log('server running at http://localhost:${port}');
});