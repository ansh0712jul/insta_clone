import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:[true,"username is required"],

    },
    email:{
        type:String,
        trim:true,
        required:[true,"email is required"],
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    profileImg:{
        type:String
    },
    bio:{
        type:String,
        trim:true
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    bookmarks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})

// hash the password before saving it to db
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next()
})

// custom to chack password is correct 

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

// method to generate access token 

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRES
        }
    )
}


// method to generate refresh token 
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRES
        }
    )
}


// creating user model 
const User = new mongoose.model("User", userSchema);
export default User