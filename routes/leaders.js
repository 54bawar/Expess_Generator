const express=require('express');
const bodyParser = require ('body-parser');

const leadRouter = express.Router();

leadRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    next();
})
.get((req,res,next)=>{
    res.end('GET request for leaders');
})

.post((req,res,next)=>{
    res.end("POST for leaders");
})

.put((req,res,next)=>{
    res.end('PUT not Supported on '+'leaders');
})

.delete((req,res,next)=>{
    res.end('Delete all the leaders');
});

//routes within parameters dishId
leadRouter.route('/:leaderId')
.all((req,res,next)=>{
   // removeEventListener.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    next();
})
.get((req,res,next)=>{
    res.end('Get for leader id: '+req.params.leaderId);
})

.post((req,res,next)=>{
    res.end('Post not supported on leaders/leaderID');
})

.put((req,res,next)=>{
    res.end('Updating the leader with leaderID: '+req.params.leaderId);
})

.delete((req,res,next)=>{
    res.end('Deleting leader with ID: '+req.params.leaderId);
});


module.exports = leadRouter;