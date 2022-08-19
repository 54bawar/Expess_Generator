const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

// FOR DISHES-----------------------------

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})

.post(authenticate.verifyUser , (req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})

.put(authenticate.verifyUser , (req, res, next) => {
    
    res.statusCode=403;
    res.end('Put not supported on Dishes');

})

.delete(authenticate.verifyUser , (req, res, next) => {
    Dishes.deleteMany({})
    .then((dish) => {

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});


//FOR DISHID-----------------------------------

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        
        if(dish==null)
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status=404;
            return next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

    }, (err) => {

        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status =404;
        return next(err);

    })
    .catch((err) => {

        next(err);

    });
})

.post(authenticate.verifyUser , (req, res, next) => {
    
    res.statusCode=403;
    res.end('Post not supported on dishes/'+req.params.dishID);

})

.put(authenticate.verifyUser , (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId,{ $set: req.body }, { new: true })
    .then((dish) => {

        if(dish==null)
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status=404;
            return next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);

    }, (err) => {

        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status=404;
        return next(err);
    })
    .catch((err) => {

        next(err);

    });
})

.delete(authenticate.verifyUser , (req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((dish) => {
        
        if(dish==null)
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status=404;
            return next(err);

        }
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);

    }, (err) =>{

        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status=404;
        return next(err);

    })
    .catch((err)=>{

        next(err);

    });
});


//  FOR COMMENTS ----------------------------------

dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        
        if(dish==null)
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status=404;
            return next(err);
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments);

    }, (err) => {

        err = new Error('Dish '+ req.params.dishId +' not found');
        err.status = 404;
        return next(err);

    })
    .catch((err) => {

        next(err);

    });
})

.post(authenticate.verifyUser , (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        if(dish==null)
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status=404;
            return next(err);
        }
    
        req.body.author = req.user._id

        dish.comments.push(req.body);
        dish.save()

        .then((dish) => {

            Dishes.findById(dish._id)
            .populate('comments.author')
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            })

        }, (err) => next(err));
    

    }, (err) => {

        err = new Error('Dish '+ req.params.dishId +' not found');
        err.status = 404;
        return next(err);

    })
    .catch((err) => next(err));
})


.put(authenticate.verifyUser , (req,res,next)=>{
    
    res.statusCode=403;
    res.end('Put not supported on Dishes/'+req.params.dishId+'/comments');

})

.delete(authenticate.verifyUser , (req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish==null){

            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status=404;
            return next(err);

        }

        for(var i=(dish.comments.length-1);i>=0;i--){
            dish.comments.id(dish.comments[i]._id).remove();
        }
        
        dish.save()
        .then((dish)=>{
            
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish);

        }, (err) => next(err));

    }, (err) => {

        err = new Error('Dish '+ req.params.dishId +' not found');
        err.status = 404;
        return next(err);

    })

    .catch((err)=>next(err));
});


// Comment ID ----------------------

dishRouter.route('/:dishId/comments/:commentId')

.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        if (dish == null || dish.comments.id(req.params.commentId) == null) {

            if(dish == null){

                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);

            }else{

                err = new Error('Comment ' + req.params.commentId + ' not found');
                err.status = 404;
                return next(err);

            }
        }
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments.id(req.params.commentId));

    }, (err) => {

        err = new Error('Dishes/dish'+req.params.dishId+' not found');
        err.status = 404;
        return next(err);

    })
    .catch((err)=>next(err));
})


.post(authenticate.verifyUser , (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on Dishes/'+ req.params.dishId
    + '/comments/' + req.params.commentId);
})


 .put(authenticate.verifyUser , (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        if (dish == null) {

            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);

        }

        if(dish.comments.id(req.params.commentId) == null){

            err = new Error('Comment '+ req.params.commentId +' not found');
            err.status = 404;
            return next(err);
        }
        
        if (req.body.rating) {
        
            dish.comments.id(req.params.commentId).rating = req.body.rating;
        }
    
        if (req.body.comment) {
    
            dish.comments.id(req.params.commentId).comment = req.body.comment;
        }
        
        if (req.body.author) {
    
            dish.comments.id(req.params.commentId).author = req.body.author;
        }

        dish.save().then((dish) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        }, (err) => next(err) ) ;

    },(err) => {

        err = new Error('Dishes/dish'+req.params.dishId+' not found');
        err.status = 404;
        return next(err);

    })
    .catch((err)=>next(err));
})


.delete(authenticate.verifyUser , (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {

        if (dish == null) {

            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);

        }if(dish.comments.id(req.params.commentId) == null){

            err = new Error('Comment ' +req.params.commentId+ ' not found');
            err.status = 404;
            return next(err);

        }

        dish.comments.id(req.params.commentId).remove();

        dish.save().then((dish) => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);

        }, (err) => next(err));
    
    }, (err) => {

        err = new Error('Dishes/dish'+req.params.dishId+' not found');
        err.status = 404;
        return next(err);

    } )
    .catch((err)=>next(err));
})

module.exports = dishRouter;