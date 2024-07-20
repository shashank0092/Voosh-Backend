import { body,param } from "express-validator";

const RegisterUserValidator=()=>{
    return[
        body('firstName')
            .notEmpty().withMessage("First Name Is Required For Creating Account"),
        body('lastName')
            .notEmpty().withMessage("Last Name Is Required For Creating Account"),
        body('email')
            .notEmpty().withMessage("Email Is Required For Creating Account")
            .isEmail().withMessage("Use Valid Email For Creating Account"),
        body('password')
            .notEmpty().withMessage("Password Is Required For Creating Account")
            .isLength({ min: 6, max: 10 }).withMessage("Password Must Be Between 6 And 10 Characters")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage("Password Must Contain At Least One Uppercase Letter, One Lowercase Letter, And One Special Character"),
        body('confirmPassword')
            .notEmpty().withMessage("Confirm Password Is Required For Creating Account")
            .custom((value, { req }) => value === req.body.password).withMessage("Passwords Do Not Match"),
        body('imagePath')
            .notEmpty().withMessage("Please Give Image Link")
    ]
}

const LoginUserValidator=()=>{
    return[ 
        body('email')
            .notEmpty().withMessage("Email Is Required For Creating Account")
            .isEmail().withMessage("Use Valid Email For Creating Account"),
        body('password')
            .notEmpty().withMessage("Password Is Required For Creating Account")
            .isLength({ min: 6, max: 10 }).withMessage("Password Must Be Between 6 And 10 Characters")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage("Password Must Contain At Least One Uppercase Letter, One Lowercase Letter, And One Special Character")
    ]
}

const GoogleLoginValidator=()=>{
    return[
        body('email')
            .notEmpty().withMessage("Email Is Required For Creating Account")
            .isEmail().withMessage("Use Valid Email For Creating Account"),
    ]
}

const VerifyEmailValidator=()=>{
    return[
        param('verificationToken')
            .notEmpty().withMessage("Verification Token Is Required")
    ]
}

const ForgetPasswordRequestValidator=()=>{
    return[
        body("email")
            .notEmpty().withMessage("Email Is Required To Forgot Password Request")
            .isEmail().withMessage("Use Valid Email For Forgot Password Request"),
    ]
}

const RestForgotPasswordValidator=()=>{
    return[
        body("resetToken")
            .notEmpty().withMessage("Reset Token Is Required To Forgot Password Request"),
        body("newPassword")
            .notEmpty().withMessage("New Password Is Required To Forgot Password Request")
            .isLength({ min: 6, max: 10 }).withMessage("Password Must Be Between 6 And 10 Characters")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage("Password Must Contain At Least One Uppercase Letter, One Lowercase Letter, And One Special Character")
    ]
}

export {
    RegisterUserValidator,
    LoginUserValidator,
    GoogleLoginValidator
}