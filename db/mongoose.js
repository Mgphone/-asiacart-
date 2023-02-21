const mongoose=require("mongoose");
mongoose.set('strictQuery',false);
mongoose
.connect(process.env.MONGO_URL)
.then(()=>console.log("Successful Connect DB"))
.catch((err)=>console.log(err));