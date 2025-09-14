const mongoose = require("mongoose");
const {createHmac,randomBytes} =require("crypto")

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    salt:{
        type:String,
        
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    },

    profileImage:{
        type:String,
        default:"/Images/avatar.png"
    },


    
},{timestamps:true})

userSchema.pre("save",function(next){
    const user= this;
    if(!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");
    const hashPassword = createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt=salt;
    this.password=hashPassword
    next();
})

userSchema.statics.matchPassword = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const hashInputPassword = createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

    if (hashInputPassword !== user.password) {
        throw new Error("Invalid password");
    }

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.salt;

    return userObj;
};

const User = mongoose.model("User",userSchema)
module.exports=User;