const express=require('express');
const bodyParser = require ('body-parser');

const promRouter = express.Router();

promRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    next();
})
.get((req,res,next)=>{
    res.end('GET for promotions');
})

.post((req,res,next)=>{
    res.end("POST for promotions");
})

.put((req,res,next)=>{
    res.end('PUT not Supported on '+'promotions');
})

.delete((req,res,next)=>{
    res.end('Delete all promotions');
});

//routes within parameters dishId
promRouter.route('/:promId')
.all((req,res,next)=>{
   // removeEventListener.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    next();
})
.get((req,res,next)=>{
    res.end('Get for promotion ID: '+req.params.promId);
})

.post((req,res,next)=>{
    res.end('Post not supported on promotions/promoid');
})

.put((req,res,next)=>{
    res.end('PUT for Promotion with id: '+req.params.promId);
})

.delete((req,res,next)=>{
    res.end('Deleting promotion with id: '+req.params.promId);
});


module.exports = promRouter;