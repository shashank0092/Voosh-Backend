import {Request,Response} from "express"
import { validationResult } from "express-validator"
import { task } from "../../models/task.model"

interface ITask {
    title?: string;
    description?: string;
    status?: string;
}

const CreateTask=async(req:Request,res:Response)=>{
  
    const errors=validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    try {
        const { title, description, creatorEmail } = req.body

        const createtask = await task.create({
            title, description, creatorEmail
        })

        if (!createtask) {
            res.status(500).json({ error: "Please Try Again Some Time Later" })
        }
        else {
            res.status(201).json({ message: "Task Created Succesfully" })
        }
    }
    catch (err) {
        res.status(500).json({ error: "An Error Occurred While Creating The Task" })
    }
    
}

const UpdateTask=async(req:Request,res:Response)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }

    try{
        const { taskId, title, description, status } = req.body;
        let updateFields:Partial<ITask> = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (status) updateFields.status = status;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No Fields Provided For Update' });
        }
        const updateResult = await task.updateOne(
            { _id: taskId },
            { $set: updateFields }
        );

        if (updateResult.modifiedCount === 0) {
            res.status(500).json({ error: 'Please Try Again Some Time Later' });
        } else {
            res.status(201).json({ message: 'Task Updated Successfully' });
        }
    }
    catch(err){
        res.status(500).json({ error: 'An Error Occurred While Updating The Task' })
    }
    
}

const DeleteTask=async(req:Request,res:Response)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    try {
        const { taskId } = req.body

        const deleteTask = await task.findByIdAndDelete({ _id: taskId })

        if (!deleteTask) {
            res.status(500).json({ error: "Please Try Again Some Time Later" })
        }
        else {
            res.status(200).json({ message: "Task Deleted Succesfully" })
        }
    }
    catch (err) {
        res.status(500).json({ error: 'An Error Occurred While Deleting The Task' })
    }
}

const GetAllTask=async(req:Request,res:Response)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})
    }
    try{
        const {creatorEmail}=req.body

        const tasks=await task.find({creatorEmail})

        if(tasks.length==0){
            return res.status(200).json({ message: "Please Add Some Task",data:tasks })
        }
        else if(tasks.length>0){
            return res.status(200).json({ message: "Tasks Fetched Succesfully",data:tasks })
        }
        else if(!tasks){
            return res.status(500).json({ error: 'An error occurred while fetching the task' })
        }

    }
    catch(err){
        res.status(500).json({ error: 'An error occurred while fetching the task' })
    }
}

export {CreateTask,UpdateTask,DeleteTask,GetAllTask}