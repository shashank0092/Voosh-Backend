import {Router} from "express"
import {RegisterUser,LoginUser,GoogleLoginUser,UploadImage,RefreshAcessToken,VerifyEmail,ForgetPasswordRequest,ResetForgottonPassword} from "../../controllers/auth/auth.controllers"
import {RegisterUserValidator,LoginUserValidator, GoogleLoginValidator,} from "../../validator/auth/User.validator"

const UserRouter=Router()

UserRouter.route("/register").post(RegisterUserValidator(),RegisterUser)
UserRouter.route("/login").post(LoginUserValidator(),LoginUser)
UserRouter.route("/googleLogin").post(GoogleLoginValidator(),GoogleLoginUser)
UserRouter.route("/imageauth").get(UploadImage)
UserRouter.route("/refresh-token").post(RefreshAcessToken)
UserRouter.route("/verify-email/:verificationToken").get(VerifyEmail)
UserRouter.route("/forgot-password").post(ForgetPasswordRequest)
UserRouter.route("/reset-password").post(ResetForgottonPassword)

export default UserRouter