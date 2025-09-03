import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js'

export const signUp = async(req,res, next)=>{
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const {name,email,password} = req.body
        const existingUser = await User.findOne({email})

        if(existingUser){
            const error = new Error('User already exists')
            error.statusCode = 409
            throw error
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //Here we used session because in case if there is any error found during the creation of user then it go directly to catch method
        const newUsers = await User.create([{name,email,password:hashedPassword}],{session}) 

        const token = jwt.sign({userId:newUsers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})

        await session.commitTransaction()
        session.endSession()

        res.status(201).json({
            success:true,
            message:'User created successfully',
            data:{
                token,
                user:newUsers[0],
            }
        })
    }
    catch(error){
        await session.abortTransaction()
        session.endSession()
        // here we write next(error) because it will directly called the "error.middleware.js" instead of passing to next middleware in chain.
        next(error)
    }
}

export const signIn = async(req,res, next)=>{
    try{
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            const error = new Error('User not Found')
            error.statusCode = 404
            throw error
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password)
        
        if(!isPasswordValid){
            const error= new Error('Invalid Password')
            error.statusCode = 401
            throw error
        }

        const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        
        res.status(200).json({
            success:true,
            message:'User signed in successfully',
            data:{
                token,
                user
            }
        })
    } 
    catch(error){
        next(error) //directly calling error.middleware.js file here
    }
    
}
export const signOut = async(req,res, next)=>{
    // req.headers.authorization=""
    // console.log(req.headers.authorization)
    console.log("updated here")
    res.status(200).json({
        success:true,
        message:'Logout successfull',
    })
}