const express=require("express");
// const path=require("path");
const router=express.Router();

//get product model
const Product=require("../models/product");
//get Category model
const Category=require("../models/category");
//get all product
// const auth=require("../config/auth");
// const isUser=auth.isUser;
router.get('/',async(req,res)=>{
  const checkLogin=(req.isAuthenticated())?true:false
  try {
    res= await Product.find((err,products)=>{
      if(err)
        console.log(err); 
      res.render("all_products",{
        title:'All Products',
        products:products,
        checkLogin:checkLogin
      });
    });
  } catch (error) {
    console.log(error);
  }
  // Product.find((err,products)=>{
  //   if(err)
  //     console.log(err); 
  //   res.render("all_products",{
  //     title:'All Products',
  //     products:products,
  //     checkLogin:checkLogin
  //   });
  // });

});

router.get("/:category",async (req,res)=>{
  const checkLogin=(req.isAuthenticated())?true:false
  var category=req.params.category;
  try {
    res= await   Category.findOne({slug:category},function(err,c){
      Product.find({category:category},function(err,products){
        if(err){console.log(err);}
          res.render("cat_products",{
          title:c.title,
          products:products,
          checkLogin:checkLogin
        })
      })
    });
  } catch (error) {
    console.log(error);
  }
  // Category.findOne({slug:category},function(err,c){
  //   Product.find({category:category},function(err,products){
  //     if(err){console.log(err);}
  //       res.render("cat_products",{
  //       title:c.title,
  //       products:products,
  //       checkLogin:checkLogin
  //     })
  //   })
  // });
});

// router.get("/:category",(req,res)=>{
//   var category=req.params.category;
  
//    Product.find({category:category},(err,products)=>{
//       if(err){console.log(err);}
      
//       res.render("cat_products",{
//         title:products.category,
//         products:products
//       })
//    })
  
// });



//Exports
module.exports=router;