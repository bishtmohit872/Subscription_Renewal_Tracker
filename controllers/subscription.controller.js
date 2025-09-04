import Subscription from "../models/subscription.model.js"
import {SERVER_URL} from '../config/env.js'
import { workflowClient } from "../config/upstash.js"
import subscriptionRouter from "../routes/subscription.routes.js"

export const getAllSubscriptions = async (req,res,next)=>{
    try{
        const allSubscriptions = await Subscription.find({user:req.user.id})
        res.status(200).json({success:true,data:allSubscriptions})
    }
    catch(error){
        next(error)
    }
}

export const getSubscriptionDetails = async(req,res,next)=>{
    try{
        const id = req.params.id
        const subscriptionDetails = await Subscription.findById(id) 

        if(!subscriptionDetails){
            res.status(401).json({message:'No subscription found in your account'})
        }
        res.status(201).json({success:true,data:subscriptionDetails})
    }   
    catch(error){
        next(error)
    }
}

export const createSubscription = async (req,res,next)=>{
    try{
        const subscription = await Subscription.create({
            ...req.body,
            user:req.user._id,
        })
        const { workflowRunId } = await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body:{
                subscriptionId:subscription.id,
            },
            headers:{
                "content-type":"application/json"
            },
            retries:0,
        })

        res.status(201).json({success:true,data:{subscription,workflowRunId}})
    }
    catch(error){
        next(error)
    }
}

export const updateSubscription = async(req,res,next)=>{
    try{
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        )
        if(!subscription){
            const error = new Error("subscription not found")
            error.statusCode = 404
            throw error
        }

        res.status(200).json({
            success:true,
            message:"Subscription updated successfully",
            data:subscription
        })
    }
    catch(error){
        next(error)
    }
}

export const deleteSubscription = async(req,res,next)=>{
    try{
        const subscription = await Subscription.findByIdAndDelete(req.params.id)
        
        if(!subscription){
            const error = new Error("Subscription not found")
            error.statusCode = 404
            throw error
        }

        res.status(200).json({
            success:true,
            message:"Subscription deleted successfully",
            data:subscription,
        })
    }
    catch(error){
        next(error)
    }
}

export const getUserSubscription = async(req,res,next)=>{
    try{
        if(req.user.id != req.params.id){
            const error = new Error('Your are not the owner of this account')
            error.statusCode = 401
            throw error
        }

        const subscriptions = await Subscription.find({user:req.params.id})
        res.status(200).json({success:true,data:subscriptions})
    }
    catch(error){
        next(error)
    }
}

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }

    // check if user is the owner of the subscription
    if (subscription.user.toString() !== req.user.id) {
      const error = new Error("You are not the owner of this subscription");
      error.statusCode = 401;
      throw error;
    }

    // set status to cancelled
    subscription.status = "cancelled";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    // check if user is the owner of the subscription
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this subscription");
      error.statusCode = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({
      user: req.params.id,
      status: "active",
    }).populate("user", "name email");

    res
      .status(200)
      .json({
        success: true,
        message: "Upcoming renewals fetched successfully",
        data: subscriptions,
      });
  } catch (error) {
    next(error);
  }
};
