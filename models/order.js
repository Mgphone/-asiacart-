const mongoose=require("mongoose");
const Schema=mongoose.Schema;
//Order Schema
const OrderSchema=Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},    
    cart:{type:Object,require:true},
    email:{type:String,require:true},
    amount:{type:Number,require:true}
// userId:{type:String, required:true},
// products:[{
//     productsId:{type:String},
//     quantity:{type:Number,default:1}
// }],
//  amount:{type:Number,required:true} 
},
{timestamps:true}
);

const Order=module.exports=mongoose.model('Order',OrderSchema);