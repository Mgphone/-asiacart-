const mongoose=require("mongoose");

//User Schema
const UserSchema=mongoose.Schema({

  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  
  },
  admin:{
    type:Number,
   
  }  
},{
  timestamps:true
}
);

const User=module.exports=mongoose.model('User',UserSchema);