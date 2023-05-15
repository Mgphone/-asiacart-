const express=require("express");
// const path =require("path");
const dotenv=require("dotenv");

const bodyParser=require("body-parser");
dotenv.config();
const session=require("express-session");
const {check,validationResult}=require("express-validator");
// const { check, validationResult } = require('express-validator');
const passport=require("passport");



//Connect to Database
require("./config/mongoose");


//Init app
const app=express();
app.use(express.json());

app.set("view engine", "ejs");
//set up public folder

app.use(express.static("public"));
//set Global errors variable
app.locals.errors=null;

//Get all pages to pass header.ejs
//get page models
let Page=require("./models/page");
Page.find((err,pages)=>{
  if (!err) {
    return app.locals.pages=pages;
  }
})

//get category to header.ejs
let Category=require("./models/category");
Category.find((err,categories)=>{
  if(!err){
    return app.locals.categories=categories;
  }
})
//Body Parser middle wear

//Body Parser Application url encoded
app.use(bodyParser.urlencoded({extended:false}));


// parse application/json
app.use(bodyParser.json());

//Express session middlewear
const MemoryStore = require('memorystore')(session)
app.use(session({
  cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))


//Express Messages Middlewear
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Config
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//session cart
app.get('*',(req,res,next)=>{
  res.locals.cart=req.session.cart;
  res.locals.user=req.user||null;
  next();
});


//set route
const users=require('./routes/users');
const products=require('./routes/products');
const pages=require('./routes/pages');
const cart=require('./routes/cart');
const adminPages=require('./routes/admin_pages');
const adminCategories=require('./routes/admin_categories')
const adminProducts=require('./routes/admin_products');


app.use('/users',users);
app.use('/cart',cart);
app.use('/products',products);
app.use('/',pages); 
app.use('/admin/pages',adminPages);
app.use('/admin/categories',adminCategories);
app.use('/admin/products',adminProducts);


//start the server

app.listen(3000,function(){
  console.log('Server started on port '+3000);
})