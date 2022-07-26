const express=require('express');
const bodyParser = require ('body-parser');

const dishRouter = express.Router();

dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    next();
})
.get((req,res,next)=>{
    res.end('Will send dishes to you');
})

.post((req,res,next)=>{
    res.end("It will create a resource i.e. dishes for you");
})

.put((req,res,next)=>{
    res.end('Not Supported on '+'dishes');
})

.delete((req,res,next)=>{
    res.end('Delete all the dishes on the server');
});

//routes within parameters dishId
dishRouter.route('/:dishId')
.all((req,res,next)=>{
   // removeEventListener.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    next();
})
.get((req,res,next)=>{
    res.end('Will get dish with id: '+req.params.dishId);
})

.post((req,res,next)=>{
    res.end('Post not supported on dishes/dishId');
})

.put((req,res,next)=>{
    res.end('Updating the dish with id: '+req.params.dishId);
})

.delete((req,res,next)=>{
    res.end('Deleting dish with id: '+req.params.dishId);
});


module.exports = dishRouter;