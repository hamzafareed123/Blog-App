const express = require("express");
const path=require("path");
const userRouter=require("./routes/user")
const {dbConnection} = require("./connection")


const app = express();
const Port=8000;

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

dbConnection("mongodb://localhost:27017/blog-app")
.then(()=>console.log("Connection establish Successfully"))
.catch((err)=>console.log("Error in Connecting Database",err))

app.use(express.urlencoded({extended:false}));

app.get("/",(req,res)=>{
    return res.render("home")
})

app.use("/user",userRouter)

app.listen(Port,()=>console.log(`Server running on ${Port}`))