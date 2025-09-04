import express from 'express'
const app = express()
import {PORT} from './config/env.js'
import connectToDatabase from './database/mongodb.js'
import cookieParser from 'cookie-parser'

import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'

import errorMiddleware from './middleware/error.middleware.js'
import arcjetMiddleware from './middleware/arcjet.middleware.js'
import workFlowRouter from './routes/workflow.routes.js'

app.listen(PORT,async ()=>{
    await connectToDatabase()
    console.log(`Server is running on http://localhost:${PORT}`)
})

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(arcjetMiddleware) //rate limiting and bot protection


app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/subscriptions',subscriptionRouter)
app.use('/api/v1/workflows',workFlowRouter)
app.use(errorMiddleware)

app.get('/',(req,res)=>{
    res.send('Please check my GitHub repository: https://github.com/bishtmohit872/Subscription_Renewal_Tracker,<br/> I have already mentioned all the APIs there. You can review them and also test them in Postman. ')
})
