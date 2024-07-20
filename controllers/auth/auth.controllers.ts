import { Request, Response } from "express"
import { user } from "../../models/user.model"
import { validationResult } from "express-validator"
import { ImageIoConfig } from "../../utils/Imagekitconfig"
import ImageKit from "imagekit";

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

const genrateAcessAndRefreshToken = async (userId: string|unknown): Promise<TokenPair> => {

    try {
        const UserData = await user.findById(userId)

        if (UserData) {
            const accessToken = await UserData?.genrateAccessToken()
            const refreshToken = await UserData?.genrateRefreshToken()
            UserData.refreshToken = refreshToken
            await UserData.save({ validateBeforeSave: true })
            return { accessToken, refreshToken }
        }
        else {
            throw new Error("User Not Find")
        }


    }

    catch (err) {
        console.log(err)
        throw new Error("Something Went Wrong While Genrating Access And Refresh Token")
    }
}

const RegisterUser = async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    try {
        const { firstName, lastName, email, password,imagePath } = req.body

        const existedUser = await user.findOne({ email })

        if (existedUser) {
            return res.status(409).json({ message: "User With This Email Already Exist" })
        }

        else{
            const createduser=await user.create({firstName,lastName,email,password,imagePath})

            if(!createduser){
                res.status(500).json({error:"Please Try Again Some Time Later"})
            }
            else{
                res.status(201).json({message:"Account Created Succesfully"})
            }
        }

    }
    catch (err) {
        res.status(500).json({ error: "An Error Occurred While Creating Account" })
    }
}

const LoginUser = async (req: Request, res: Response) => {

    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
      
    const {email,password}=req.body

    try{
        const userdata=await user.findOne({email})

        if(!userdata){
            res.status(404).json({ message: "User does not exist" })
        }
        else if(userdata.googleLogin){
            return res.status(401).json({message:"This Email Account Is Used As A Google Login"})
        }
        else{
            const isPasswordCorrect = await userdata.isPasswordCorrect(password)
            if(isPasswordCorrect){
                const { accessToken, refreshToken } = await genrateAcessAndRefreshToken(userdata._id)
                const loggedInUser = await user.findById(userdata._id).select(
                    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
                )
    
                return res.status(200).cookie("accessToken",accessToken).cookie("refreshToken",refreshToken)
                       .json({loginInUserDetails:loggedInUser,accessToken,refreshToken,message:"Login Succesfully"})  
            }
            else{
                return res.status(401).json({message:"Invaild Credaintials"})
            }
        }
    }
    catch(err){
        res.status(500).json({ error: "An Error Occurred While Login" })
    }


}

const GoogleLoginUser = async (req: Request, res: Response) => {
    const errors=validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    try{
        const {email,firstName,lastName,imagePath}=req.body

        const existedUser=await user.findOne({email})

        if(existedUser){
            if(existedUser.googleLogin){
                const { accessToken, refreshToken } = await genrateAcessAndRefreshToken(existedUser._id)
                const loggedInUser = await user.findById(existedUser._id).select(
                    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
                )
    
                return res.status(200).cookie("accessToken",accessToken).cookie("refreshToken",refreshToken)
                       .json({loginInUserDetails:loggedInUser,accessToken,refreshToken,message:"Login Succesfully"})  
            }
            else{
                return res.status(401).json({message:"This Email Account Is Not Used As A Google Login"})
            }
        }
        else{
            const createduser=await user.create({firstName,lastName,email,imagePath,googleLogin:true})

            if(!createduser){
                res.status(500).json({error:"Please Try Again Some Time Later"})
            }
            else{
                const { accessToken, refreshToken } = await genrateAcessAndRefreshToken(existedUser._id)
                const loggedInUser = await user.findById(existedUser._id).select(
                    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
                )
                res.status(201).json({message:"Account Created With Google Succesfully",loginInUserDetails:loggedInUser,accessToken,refreshToken})
                .cookie("accessToken",accessToken).cookie("refreshToken",refreshToken)
            }
        }
    }
    catch(err){
        res.status(500).json({ error: "An Error Occurred While Google Login" })
    }

}

const UploadImage = async (req: Request, res: Response) => {
    try {
        const config = await ImageIoConfig()

        if (config instanceof ImageKit) {
            const result = config.getAuthenticationParameters()
            res.send(result)
        }
        else {
            res.status(500)
                .json({ message: "Not have image io instance" })
        }


    }
    catch (err) {
        res.json({ err: err, message: "Can not get image uploading authenticator" })
    }
}

const VerifyEmail = async (req: Request, res: Response) => {

}

const ForgetPasswordRequest = async (req: Request, res: Response) => {

}

const ResetForgottonPassword = async (req: Request, res: Response) => {

}

const RefreshAcessToken = async (req: Request, res: Response) => {

}

export {
    RegisterUser,
    LoginUser,
    GoogleLoginUser,
    UploadImage,
    VerifyEmail,
    ForgetPasswordRequest,
    ResetForgottonPassword,
    RefreshAcessToken
}