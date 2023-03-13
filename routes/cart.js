const express=require("express");
// const path=require("path");
const router=express.Router();
const Page=require("../models/product");
const Order=require("../models/order");
const { Result } = require("express-validator");

//get add to product cart
router.get("/add/:product",function(req,res){

  const slug=req.params.product;

  Page.findOne({slug:slug},(err,p)=>{
   
    if(err){
      console.log(err);
    }
    if(typeof req.session.cart=="undefined"){
      req.session.cart=[];
      req.session.cart.push({
        title:slug,
        qty:1,
        price:parseFloat(p.price).toFixed(2),
        image:p.imageUrl
      });
      
    }else{
      let cart=req.session.cart;
      var newItem=true;
      for(let i=0; i<cart.length; i++){
        if(cart[i].title==slug){
          cart[i].qty++;
          newItem=false;
          break;
        }
      }
      if(newItem){
        cart.push({
          title:slug,
          qty:1,
          price:parseFloat(p.price).toFixed(2),
          image:p.imageUrl
        });
      }
    }
     ///log req session cart
     req.flash("Success","Product added");
     res.redirect('back');
     console.log(req.session.cart);
  
  });
 
  
});

router.get("/checkout",(req,res)=>{
  if (req.session.cart && req.session.cart.length==0){
        delete  req.session.cart;
        res.redirect('/cart/checkout')
  }else{
  res.render("checkout",{
    title:"Checkout",
    cart:req.session.cart
  });
}
})

router.get("/update/:product",(req,res)=>{
  var slug=req.params.product;
  var action=req.query.action;
  var cart=req.session.cart;
  for (let i = 0; i < cart.length; i++) {
    if(cart[i].title==slug){
      switch(action){
        case "add":
          cart[i].qty++;
          break;
        case "remove":
          cart[i].qty--;
          if(cart[i].qty<1)
          cart.splice(i,1);
          break;
        case "clear":
          cart.splice(i,1);
          if(cart.length==0)
          cart.splice(i,1);
          
          break;
        default:
          console.log("update problem");
          break;
      }
      break;
    }
  }
  
  req.flash('success','Cart updated');
  res.redirect('/cart/checkout');
})

router.get("/clear",(req,res)=>{
  delete req.session.cart;
  req.flash('success','Cart Deleted');
  res.redirect('/cart/checkout');
})

//for buy now 
router.post("/buynow",async(req,res)=>{
  

  if(!req.session.cart){
    return res.redirect("/cart/checkout");
    }
    const buyCart=req.session.cart;
    const buyUser=req.user;
    const amount=req.body.amount;
    console.log(buyUser,buyCart,amount,buyUser.email);
    const order=new Order({
      user:buyUser,
      cart:buyCart,
      email:buyUser.email,
      amount:amount
    });
    try {
      await order.save((err,result)=>{
        req.flash('Success','Succefully Brought Product');
        delete req.session.cart;
        res.redirect('/');
      });  
    } catch (error) {
      console.log(error);
    }
    
});



//Exports
module.exports=router;