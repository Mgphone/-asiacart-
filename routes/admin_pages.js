const express=require("express");

const mongoose=require("mongoose");
const { findByIdAndRemove } = require("../models/page");
const {check,validationResult}=require('express-validator');

// const path=require("path");
const router=express.Router();
//Get Page Model
const Page=require("../models/page");
auth=require("../config/auth");
const isAdmin=auth.isAdmin;


// Get pages index

router.get('/',isAdmin,function(req,res){
  
 Page.find({},function(err,pages){
  if(!err){
   
    res.render('admin/pages',{
      pages:pages
    })
  }
 });
});



router.get('/add-page',isAdmin,function(req,res){
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
router.post("/add-page",[
  check('title','Title Must have a value').notEmpty(),
  check('content','Content Must have a value').notEmpty()
],(req,res)=>{
  // req.checkBody('title','Title Must have a value').notEmpty();
  // req.checkBody('content','Content Must have a value').notEmpty();

  var title=req.body.title;
  var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
  if(slug=="")slug=title.replace(/\s+/g,'-').toLowerCase();
  var content=req.body.content;

  var errors=validationResult(req)
  if(!errors.isEmpty()){
    console.log("error");
    res.render('admin/add_page',{
      errors:errors.errors,
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
router.get('/edit-page/:id',isAdmin,(req,res)=>{
  
  
  Page.findById(req.params.id,function(err,page){
  
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



/*
 * POST edit page
 */
router.post('/edit-page/:id',[
  check('title', 'Title must have a value.').notEmpty(),
  check('content', 'Content must have a value.').notEmpty()
], function (req, res) {

  // req.checkBody('title', 'Title must have a value.').notEmpty();
  // req.checkBody('content', 'Content must have a value.').notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug == "")
      slug = title.replace(/\s+/g, '-').toLowerCase();
  var content = req.body.content;
  var id = req.params.id;

  var errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.render('admin/edit_page', {
          errors: errors.errors,
          title: title,
          slug: slug,
          content: content,
          id: id
      });
  } else {
      Page.findOne({slug: slug, _id: {'$ne': id}}, function (err, page) {
          if (page) {
              req.flash('danger', 'Page slug exists, choose another.');
              res.render('admin/edit_page', {
                  title: title,
                  slug: slug,
                  content: content,
                  id: id
              });
          } else {

              Page.findById(id, function (err, page) {
                  if (err)
                      return console.log(err);

                  page.title = title;
                  page.slug = slug;
                  page.content = content;

                  page.save(function (err) {
                      if (err)
                          return console.log(err);

                      Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                          if (err) {
                              console.log(err);
                          } else {
                              req.app.locals.pages = pages;
                          }
                      });


                      req.flash('success', 'Page edited!');
                      res.redirect('/admin/pages');
                  });

              });


          }
      });
  }

});


//get delete page

router.get('/delete-page/:id',isAdmin,(req,res)=>{
  console.log(req.params.id);
  Page.findByIdAndRemove(req.params.id,(err)=>{
    if(err) console.log(err);
    req.flash('success','Paged Deleted');
    res.redirect('/admin/pages');
  });
});


module.exports=router;

