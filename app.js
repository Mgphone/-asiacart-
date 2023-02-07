const express=require("express");
const path =require("path");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
dotenv.config();
const session=require("express-session");
const expressValidator=require("express-validator");




//Connect to Database
mongoose.set('strictQuery',false);
mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("Successful Connect DB"))
.catch((err)=>console.log(err));
//Init app
const app=express();

//View Engine setup
// app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
//set up public folder
app.use(express.static("public"));
//set Global errors variable
app.locals.errors=null;

//Body Parser middle wear

//Body Parser Application url encoded
app.use(bodyParser.urlencoded({extended:true}));


// parse application/json
app.use(bodyParser.json());

//Express session middlewear
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
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
}));

//Express Messages Middlewear
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


const pages=require('./routes/pages');
const adminPages=require('./routes/admin_pages');


app.use('/admin/pages',adminPages);

app.use('/',pages); 


//start the server

app.listen(process.env.port,function(){
  console.log('Server started on port '+process.env.PORT);
})