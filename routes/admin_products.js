const express=require("express");
const mongoose=require("mongoose");
const router=express.Router();
const { check, validationResult } = require('express-validator');
const path=require("path");
auth=require("../config/auth");
const isAdmin=auth.isAdmin;




// get Model
const Product=require("../models/product");
const Category=require("../models/category");


const cloudinary=require("../util/cloudinary");
const upload = require("../util/multer");
const product = require("../models/product");
const { log } = require("console");


;

// Get Product index

router.get('/',isAdmin,function(req,res){
    Product.find((err,products)=>{
        
            res.render('admin/products',{
              products:products,
            })
        
        });

});


//get add products
router.get('/add-product',isAdmin,function(req,res){
  var title="";
  var quantity="";
  var price="";
  var imageUrl='';
  Category.find((err,categories)=>{
  res.render('admin/add_product',{
    title:title,
    categories:categories,
    quantity:quantity,
    price:price,
    imageUrl:imageUrl
  });
})

});


//post add product
router.post('/add-product',upload.single('image'), async(req, res)=> {

    const imageResult= await cloudinary.uploader.upload(req.file.path,{folder:'cmscart'});        
    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var price = req.body.price;
    var category = req.body.category;
    var quantity=req.body.quantity;
    var imageFile=imageResult.url;
    var publicId=imageResult.public_id
   

              var product = new Product({
                  title: title,
                  slug: slug,
                  quantity:quantity,
                  price: price,
                  category: category,
                  imageUrl: imageFile,
                  publicId:publicId
              });
              try {
                await product.save()
              } catch (error) {
                console.log(error);
              }
             
             res.redirect('/admin/products');
                
                            

           
});










//get Edit products
router.get('/edit-product/:id',isAdmin,(req,res)=>{
  
  
  Category.find((err,categories)=>{
    if(!err)
    Product.findById(req.params.id,function(err,product){
      console.log(product);
      if(err)
      return console.log(err);
      if(!err)
      res.render('admin/edit_product',{
          id:product._id,
          price:product.price,
          title:product.title,
          quantity:product.quantity,
          categories:categories,
          category: product.category.replace(/\s+/g, '-').toLowerCase(),
          imageUrl:product.imageUrl,
          publicId:product.publicId
      });
    });
  })
  
 
});



/*
 * POST edit Product
 */
router.post('/edit-product/:id',[],upload.single("image"),async(req,res)=>{
  try {
    let product=await Product.findById(req.params.id);   
    //delete image from cloudinary    
    await cloudinary.uploader.destroy(product.publicId).then((err)=>console.log(err));
    //upload image to cloudinary  
    let imageResult= await cloudinary.uploader.upload(req.file.path,{folder:'cmscart'});   
    let data={
      title:req.body.title||product.name,
      slug:req.body.title||product.slug, 
      price:req.body.price||product.price,
      quantity:req.body.quantity||product.quantity,     
      category:req.body.category||product.category,
      imageUrl:imageResult.url||product.imageUrl,
      publicId:imageResult.publicId||product.publicId
    };
    console.log(data);
    product=await Product.findByIdAndUpdate(req.params.id,data,{new:true},(err)=>{
      if(err) console.log(err);
    }).clone();
  } catch (error) {
    console.log(error);
  }
  res.redirect('/admin/products');
})


//get delete Product

router.get('/delete-product/:id',isAdmin,async(req,res)=>{
  try {
    let product=await Product.findById(req.params.id);
    await cloudinary.uploader.destroy(product.publicId);
    await product.remove();
  } catch (err) {
    console.log(err);
  }
  res.redirect('/admin/products');
  // console.log(req.params.id);
  // Page.findByIdAndRemove(req.params.id,(err)=>{
  //   if(err) console.log(err);
  //   req.flash('success','Paged Deleted');
  //   res.redirect('/admin/pages');
  // });

});


module.exports=router;
