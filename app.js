const express=require("express");
// const path =require("path");
const dotenv=require("dotenv");

const bodyParser=require("body-parser");
dotenv.config();
const session=require("express-session");
const expressValidator=require("express-validator");

const { check, validationResult } = require('express-validator');



//Connect to Database
require("./db/mongoose");
//Init app
const app=express();


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
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

//Need to set up for express validator

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
//   ,customValidators: {
//     isImage: function (value, filename) {
//         var extension = (path.extname(filename)).toLowerCase();
//         switch (extension) {
//             case '.jpg':
//                 return '.jpg';
//             case '.jpeg':
//                 return '.jpeg';
//             case '.png':
//                 return '.png';
//             case '':
//                 return '.jpg';
//             default:
//                 return false;
//         }
//     }
// } 
}));

// Express Validator middleware
// app.use(expressValidator({
//   errorFormatter: function (param, msg, value) {
//       var namespace = param.split('.')
//               , root = namespace.shift()
//               , formParam = root;

//       while (namespace.length) {
//           formParam += '[' + namespace.shift() + ']';
//       }
//       return {
//           param: formParam,
//           msg: msg,
//           value: value
//       };
//   }
// }));

//Express Messages Middlewear
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//session cart
app.get('*',(req,res,next)=>{
  res.locals.cart=req.session.cart;
  next();
});


//set route
const products=require('./routes/products');
const pages=require('./routes/pages');
const cart=require('./routes/cart');
const adminPages=require('./routes/admin_pages');
const adminCategories=require('./routes/admin_categories')
const adminProducts=require('./routes/admin_products')

app.use('/cart',cart);
app.use('/products',products);
app.use('/',pages); 
app.use('/admin/pages',adminPages);
app.use('/admin/categories',adminCategories);
app.use('/admin/products',adminProducts);


//start the server

app.listen(process.env.port,function(){
  console.log('Server started on port '+process.env.PORT);
})