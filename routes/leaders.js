const express=require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const leadRouter = express.Router();

leadRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})

    .then((leader) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})

.post(authenticate.verifyUser , (req, res, next) => {
    Leaders.create(req.body)
    .then((leader) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})

.put(authenticate.verifyUser , (req, res, next) => {
    
    res.statusCode=403;
    res.end('Put not supported on Leaders');

})

.delete(authenticate.verifyUser , (req, res, next) => {
    Leaders.deleteMany({})
    .then((leader) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});


//FOR DISHID-----------------------------------

leadRouter.route('/:leaderId')
.get((req, res, next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        
        if(leader==null)
        {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status=404;
            return next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => {

        err = new Error('Leader ' + req.params.leaderId + ' not found');
        err.status =404;
        return next(err);

    })
    .catch((err) => {

        next(err);

    });
})

.post(authenticate.verifyUser , (req, res, next) => {
    
    res.statusCode=403;
    res.end('Post not supported on Leaders/'+req.params.leaderID);

})

.put(authenticate.verifyUser , (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId,{ $set: req.body }, { new: true })
    .then((leader) => {

        if(leader==null)
        {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status=404;
            return next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    }, (err) => {

        err = new Error('Leader ' + req.params.leaderId + ' not found');
        err.status=404;
        return next(err);
    })
    .catch((err) => {

        next(err);

    });
})

.delete(authenticate.verifyUser , (req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
    .then((leader) => {
        
        if(leader==null)
        {
            err = new Error('Leader ' + req.params.leaderId + ' not found');
            err.status=404;
            return next(err);

        }
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);

    }, (err) =>{

        err = new Error('Leader ' + req.params.leaderId + ' not found');
        err.status=404;
        return next(err);

    })
    .catch((err)=>{

        next(err);

    });
});

module.exports = leadRouter;