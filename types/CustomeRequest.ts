import {Request} from "express"

export interface CustomeRequest extends Request {
    
    loginuser:{
        _id: string;
        email: string;
        firstName: string;
        lastName:string;
        imagePath?: string;
       
      }

}