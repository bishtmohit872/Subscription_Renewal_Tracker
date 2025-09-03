import {Router} from 'express'
import authorize from '../middleware/auth.middleware.js'
import { getAllSubscriptions, createSubscription, updateSubscription, deleteSubscription,getSubscriptionDetails,getUserSubscription,cancelSubscription,getUpcomingRenewals } from '../controllers/subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.get('/',authorize,getAllSubscriptions)

subscriptionRouter.get('/:id',authorize,getSubscriptionDetails)

subscriptionRouter.post('/',authorize,createSubscription)

subscriptionRouter.put('/:id',authorize,updateSubscription)

subscriptionRouter.delete('/:id',authorize,deleteSubscription)

subscriptionRouter.get('/user/:id',authorize,getUserSubscription)

subscriptionRouter.put('/:id/cancel',authorize,cancelSubscription)

subscriptionRouter.get('/user/:id/upcoming-renewals',authorize,getUpcomingRenewals)

export default subscriptionRouter
 