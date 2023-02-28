const express=require("express");
// const path=require("path");
const router=express.Router();
const passport=require("passport");
const bcrypt=require('bcryptjs');
const {check,validationResult}=require("express-validator");
//Get User Model
const User=require("../models/user");


//Get Register
router.get("/register",function(req,res){
  res.render("register",{
    title:"Register"
  }); 
})

//Post Register
router.post("/register",[

  check('email','Email ir required!').isEmail(),
  check('password','Password is required').notEmpty(),
  check('password2').custom((value,{req})=>{
    if(value!=req.body.password){
      throw new Error('Passwords do not Match');
    };
    return true;
  }),
],(req,res)=>{
  
  var username=req.body.email;
  var password=req.body.password;
  let password2=req.body.password2;
  let errors=validationResult(req);

  if(!errors.isEmpty()){
    res.render('register',{
      errors:errors.errors,
      user:null,
      title:'Register'  
    });
  }else {
    User.findOne({email:username},function(err,user){
      if(err) console.log(err);
      if(user){
        req.flash('danger','Username exit');
        res.redirect('/users/register');
      }
      else{
        let user=new User({
          email:username,
          password:password,
          admin:0
        });
        bcrypt.genSalt(10,(err,salt)=>{
          bcrypt.hash(user.password,salt,(err,hash)=>{
            if (err) console.log(err);
            user.password=hash;
            user.save((err)=>{
              if(err) {
                console.log(err)
              }else{
                req.flash('success','You are now registerted');
                res.redirect('/');
              }
            })
          })
        });
      }
    
    });
  }
  });

  //get login
  router.get("/login",function(req,res){
    if (res.locals.user) res.redirect("/");
    res.render("login",{
      title:"Login"
    }); 
  })

  /*
 * POST login
 */
  router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
    
});

//get Logout
router.get("/logout",function(req,res){
  req.logout((err)=>{
      if(err){return err}
      req.flash('Success',"You are logged out");
      res.redirect('/users/login');
  });
  
  }); 

//Exports
module.exports=router;