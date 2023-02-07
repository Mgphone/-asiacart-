const express=require("express");
// const path=require("path");
const router=express.Router();

router.get("/",function(req,res){
  res.render('index',{
    title:"Home"
  });
  
});




//Exports
module.exports=router;