import {body} from "express-validator"

const CreateTaskValidator=()=>{
    return[
        body('title')
            .notEmpty().withMessage("Title Is Required For Creating Task")
            .isLength({max:100}).withMessage("Title Must Be At Most 100 Characters Long"),
        body('description')
            .notEmpty().withMessage('Description Is Required Creating Task')
            .isLength({ max: 500 }).withMessage('Description Must Be At Most 500 Characters Long'),
        body('creatorEmail')
            .notEmpty().withMessage('Email is required Creating Task')
            .isEmail().withMessage('Use An Valid Email Address For Creating Task')
    ]
}

const UpdateTaskValidator=()=>{
    return[
        body('taskId')
            .notEmpty().withMessage("Task Id Is Required For Updating Task")
    ]
}

const DeleteTaskValidator=()=>{
    return[
        body('taskId')
            .notEmpty().withMessage("Task Id Is Required For Deleting Task")
    ]
}

const GetAllTaskValidator=()=>{
    return[
        body('creatorEmail')
            .notEmpty().withMessage("Task Id Is Required For Deleting Task")
            .isEmail().withMessage('Use An Valid Email Address For Creating Task')
    ]
}


export {CreateTaskValidator,UpdateTaskValidator,DeleteTaskValidator,GetAllTaskValidator}