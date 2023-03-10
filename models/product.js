const mongoose=require("mongoose");

//Product Schema
const ProductSchema=mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  slug:{
    type:String
  },
 
  category:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  
  },
  publicId:{
    type:String,
    required:true
  },
  quantity:{
    type:Number,
    required:true
  }
},{timestamps:true});

const Product=module.exports=mongoose.model('Product',ProductSchema);