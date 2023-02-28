const express=require("express");
const mongoose=require("mongoose");
const {check,validationResult}=require("express-validator");
const { findByIdAndRemove } = require("../models/page");
// const path=require("path");
const router=express.Router();
//Get Page Model
var Category=require("../models/category");
// const category = require("../models/category");
const auth=require('../config/auth');
const isAdmin=auth.isAdmin;

// Get Category index

router.get('/',isAdmin,function(req,res){
  
 Category.find(function(err,categories){
  if(!err){
       res.render('admin/categories',{
      categories:categories
    })
  }
 });
});;


//get add-category
router.get('/add-category',isAdmin,function(req,res){
  var title="";
  var slug="";

  res.render('admin/add_category',{
    title:title,
    slug:slug,
   
  });
});

/*
* POST add-category
*/
router.post("/add-category",[check('title','Title Must have a value').notEmpty()],(req,res)=>{
  
  

  var title=req.body.title;
  var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
  if(slug=="")slug=title.replace(/\s+/g,'-').toLowerCase();
  
  // var errors=req.validationErrors();
  var errors=validationResult(req)

  if(!errors.isEmpty()){
   
    res.render('admin/add_category',{
      errors:errors.errors,
      title:title,
      slug:slug,
    
    });
  }else{
      Category.findOne({slug:slug},(err,category)=>{
      
        if(category){
          req.flash('danger','Page Exit Choose other');
          res.render('admin/category',{
            title:title,
            slug:slug,
           
          });
        }else{
          var category=new Category({
            title:title,
            slug:slug,
          
            sorting:100
          });
          category.save(function(err){
            if(err)
            return console.log(err);
            req.flash('success','Page added');
            res.redirect('/admin/categories');
          });
          
        }
      })
    }
  
});



//get Edit category
router.get('/edit-category/:id',isAdmin,(req,res)=>{
  
  
  Category.findById(req.params.id,function(err,category){
  
    if(err)
    return console.log(err);
    
    res.render('admin/edit_category',{
      title:category.title,
      slug:category.slug,      
      id:category._id
    });
  });
});



/*
 * POST edit Category
 */
router.post('/edit-category/:id',[
  check('title', 'Title must have a value.').notEmpty()],
  function (req, res) {

  // req.checkBody('title', 'Title must have a value.').notEmpty();
  

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug == "")
      slug = title.replace(/\s+/g, '-').toLowerCase();
  var id = req.params.id;
  
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
        return  res.render('admin/edit_category', {
              errors: errors.errors,
              title: title,
              slug: slug,       
              id: id
      });
  } 
      Category.findOne({slug: slug, _id: {'$ne': id}}, function (err, category) {
          if (category) {
              req.flash('danger', 'Page slug exists, choose another.');
              res.render('admin/edit_category', {
                  title: title,
                  slug: slug,
                 
                  id: id
              });
          } else {

              Category.findById(id, function (err, category) {
                  if (err)
                      return console.log(err);

                  category.title = title;
                  category.slug = slug;
                  

                  category.save(function (err) {
                      if (err)
                          return console.log(err);

                      Category.find({}).sort({sorting: 1}).exec(function (err, categories) {
                          if (err) {
                              console.log(err);
                          } else {
                              req.app.locals.categories = categories;
                          }
                      });


                      req.flash('success', 'Page edited!');
                      res.redirect('/admin/categories');
                  });

              });


          }
      });
  

});


//get delete page

router.get('/delete-category/:id',isAdmin,(req,res)=>{
  
  Category.findByIdAndRemove(req.params.id,(err)=>{
    if(err) console.log(err);
    req.flash('success','Paged Deleted');
    res.redirect('/admin/categories');
  });
});


module.exports=router;

