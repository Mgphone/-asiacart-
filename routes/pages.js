const express=require("express");
// const path=require("path");
const router=express.Router();
const Page=require("../models/page");
router.get("/",function(req,res){
  Page.findOne({slug:"home"},(err,page)=>{
    console.log(page);
    if(err){
      console.log(err);
    }else
    res.render('index',{
      title:page.title,
      content:page.content
    })
  });
 
  
})


router.get("/:slug",function(req,res){
  const slug=req.params.slug;
  Page.findOne({slug:slug},(err,page)=>{
    console.log(page);
    if (err){
      console.log(err);
    }
    if(!page){
      res.redirect('/');
    }
    else{
      res.render('index',{
        title:page.title,
        content:page.content
      })
    }
  });
});




//Exports
module.exports=router;