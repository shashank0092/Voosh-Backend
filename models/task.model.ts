import mongoose, { Schema,Document,Model } from "mongoose";

interface TaskDocument extends Document{
    title:string,
    description:string,
    creatorEmail:string,
    status:string
}

const TaskSchema=new Schema <TaskDocument>(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        creatorEmail:{
            type:String,
            required:true,
            index:true
        },
        status:{
            type:String,
            default:"created",
            required:true
        }
    },
    {timestamps:true}
)

export const task:Model<TaskDocument>=mongoose.model<TaskDocument>("Task",TaskSchema)