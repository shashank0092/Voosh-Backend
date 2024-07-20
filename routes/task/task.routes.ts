import {Router} from "express"
import { CreateTaskValidator,DeleteTaskValidator,GetAllTaskValidator,UpdateTaskValidator } from "../../validator/task/task.validator"
import { CreateTask,DeleteTask,GetAllTask,UpdateTask } from "../../controllers/task/task.controller"
import { verifyJWT } from "../../middleware/auth.middleware"


const TaskRoute=Router()

TaskRoute.use(verifyJWT)

TaskRoute.route("/createTask").post(CreateTaskValidator(),CreateTask)
TaskRoute.route("/updateTask").put(UpdateTaskValidator(),UpdateTask)
TaskRoute.route("/deleteTask").delete(DeleteTaskValidator(),DeleteTask)
TaskRoute.route("/getAllTask").post(GetAllTaskValidator(),GetAllTask)

export default TaskRoute