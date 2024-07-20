import mongoose, { Schema,Document,Model } from "mongoose";
import bcrypt from "bcrypt"
import jwt, { Secret } from "jsonwebtoken"
import crypto from "crypto"

interface UserDocument extends Document{
    email:string;
    firstName:string;
    lastName:string;
    imagePath?:string;
    password:string;
    googleLogin:boolean;
    refreshToken?:string;
    isEmailVerified:boolean;
    forgotPasswordToken?: string;
    forgotPasswordExpiry?: Date;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
    
    isPasswordCorrect(password: string): Promise<boolean>;
    genrateAccessToken(): string;
    genrateRefreshToken(): string;
    genrateTemporaryToken(): { unHashedToken: string, hashedToken: string, tokenExpiry: Date };

}

const UserSchema=new Schema<UserDocument>(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            index:true
        },
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        imagePath:{
            type:String,
        },
        password:{
            type:String,
            required: function() {
                return !this.googleLogin;
            }
        },
        googleLogin:{
            type:Boolean,
            default:false
        },
        refreshToken:{
            type:String
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },
        forgotPasswordToken:{
            type:String
        },
        forgotPasswordExpiry:{
            type:Date
        },
        emailVerificationToken:{
            type:String
        },
        emailVerificationExpiry:{
            type:Date
        }
    },
    {timestamps:true}
)

UserSchema.pre<UserDocument>("save",async function(next){
    if(!this.isModified("password")) return next()

    this.password=await bcrypt.hash(this.password,10)
    next()
})

UserSchema.methods.isPasswordCorrect=async function(password:string):Promise<boolean>{
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.genrateAccessToken=function(){
    const payload = {
        name: this.name,
        _id: this._id,
        email: this.email
    };

    
    const secretKey: Secret = process.env.ACCESS_TOKEN_SCERET_KEY as Secret;
    
    const expiresIn =process.env.ACCESS_TOKEN_EXPIRY;
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token
}

UserSchema.methods.genrateRefreshToken=function(){
    const payload={
        _id:this._id
    }
    const secretKey: Secret = process.env.REFRESH_TOKEN_SCERET_KEY as Secret;
    const expiresIn =process.env.REFRESH_TOKEN_EXPIRY;
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token
}

UserSchema.methods.genrateTemporaryToken=function(){

    const unHashedToken=crypto.randomBytes(20).toString("hex")
    const hashedToken=crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex")
    const tokenExpiry=Date.now()+20000
    return {unHashedToken,hashedToken,tokenExpiry}
}

export const user:Model<UserDocument> = mongoose.model<UserDocument>("User",UserSchema)