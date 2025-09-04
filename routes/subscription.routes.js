import {Router} from 'express'
import authorize from '../middleware/auth.middleware.js'
import { getAllSubscriptions, createSubscription, updateSubscription, deleteSubscription,getSubscriptionDetails,getUserSubscription,cancelSubscription,getUpcomingRenewals } from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.get('/all',authorize,getAllSubscriptions)

subscriptionRouter.get('/:id',authorize,getSubscriptionDetails)

subscriptionRouter.post('/create',authorize,createSubscription)

subscriptionRouter.put('update/:id',authorize,updateSubscription)

subscriptionRouter.delete('delete/:id',authorize,deleteSubscription)

subscriptionRouter.get('/user/:id/subscriptions',authorize,getUserSubscription)

subscriptionRouter.put('/:id/cancel',authorize,cancelSubscription)

subscriptionRouter.get('/user/:id/upcoming-renewals',authorize,getUpcomingRenewals)

export default subscriptionRouter
 
