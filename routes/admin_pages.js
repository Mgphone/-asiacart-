const express=require("express");
const mongoose=require("mongoose");
// const path=require("path");
const router=express.Router();
//Get Page Model
var Page=require("../models/page");


// Get pages index

router.get('/',function(req,res){
 Page.find({},function(err,pages){
  if(!err){
   
    res.render('admin/pages',{
      pages:pages
    })
  }
 });
});



router.get('/add-page',function(req,res){
  var title="";
  var slug="";
  var content="";
  res.render('admin/add_page',{
    title:title,
    slug:slug,
    content:content
  });
});

/*
* POST add Page
*/
router.post("/add-page",(req,res)=>{
  req.checkBody('title','Title Must have a value').notEmpty();
  req.checkBody('content','Content Must have a value').notEmpty();

  var title=req.body.title;
  var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
  if(slug=="")slug=title.replace(/\s+/g,'-').toLowerCase();
  var content=req.body.content;
  var errors=req.validationErrors();
  if(errors){
    console.log("error");
    res.render('admin/add_page',{
      errors:errors,
      title:title,
      slug:slug,
      content:content
    });
  }else{
      Page.findOne({slug:slug},(err,page)=>{
        if(page){
          req.flash('danger','Page Exit Choose other');
          res.render('admin/add_page',{
            title:title,
            slug:slug,
            content:content
          });
        }else{
          var page=new Page({
            title:title,
            slug:slug,
            content:content,
            sorting:100
          });
          page.save(function(err){
            if(err)
            return console.log(err);
            req.flash('success','Page added');
            res.redirect('/admin/pages');
          });
          
        }
      })
    }
  
});



//get Edit pages
router.get('/edit-page/:slug',(req,res)=>{
  
  
  Page.findById(req.params.slug,function(err,page){
  
    if(err)
    return console.log(err);
    res.render('admin/edit_page',{
      title:page.title,
      slug:page.slug,
      content:page.content,
      id:page._id
    });
  });
});

module.exports=router;

