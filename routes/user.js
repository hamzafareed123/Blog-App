const { Router } = require("express")
const User =require("../models/user")

const router = Router();

router.get("/signin",(req,res)=>{
    return res.render("signin")
})

router.get("/signup",(req,res)=>{
    return res.render("signup")
})

router.post("/signup",async (req,res)=>{
   try {
     const {fullName,email,password}=req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({err:"All Filds are Required"})
    }
    await User.create({
        fullName,
        email,
        password,
    })

    res.redirect("/user/signin")
   } catch (error) {
    return res.status(500).json({err:"Some thing went wrong in signUp"})
   }
})

router.post("/signin", async(req,res)=>{
    try {
        const {email,password} =req.body;

  const token= await User.matchPasswordAndGenerateToken(email,password)
    if(!token){
        return res.status(400).json("Incorrect")
       
    }

    res.cookie("token", token, { httpOnly: true, secure: false, }).redirect("/");
    } catch (error) {
        return res.render("signin",{
            locals: { error: "Invalid Email or Password" }
        })
    }
})

module.exports=router