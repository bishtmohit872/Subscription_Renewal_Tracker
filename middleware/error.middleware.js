const errorMiddleware = (err,req,res,next)=>{
    try{
        let error = {...err}
        error.message = err.message
        console.error(err)

        if(err.name === 'CastError'){
            const message = 'Resource not found'
            error = new Error(message)
            error.statusCode = 404
        }

        else if(err.code === 11000)
        {
            const message = 'Duplicate field value entered'
            error = new Error(message)
            error.statusCode = 400
        }

        else if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value => value.message)
            error = new Error(message.join(","))
            error.statusCode = 400
        }

        else if(err.name === 'MongooseError'){
            const message = "Mongoose take more than 10 second to connect"
            error = new Error(message)
            error.status = 500
        }

        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server Error'})
    }
    catch(error){
        next(error) //this will pass error to next middleware or something next to another
    }
}

export default errorMiddleware