var express = require("express");
var router  = express.Router({mergeParams: true});
var Topic = require("../models/topic");
var Resource = require("../models/resource");
var middleware = require('../middleware');

//Resources New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find topic by id
    //console.log(req.params.id);
    Topic.findById(req.params.id, function(err, topic){
        if(err){
            console.log(err);
        } else {
             res.render("resources/new", {topic: topic});
        }
    })
});

//Resources Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup topic using ID
   Topic.findById(req.params.id, function(err, topic){
       if(err){
           console.log(err);
           res.redirect("/topics");
       } else {
        Resource.create(req.body.resource, function(err, resource){
           if(err){
               console.log(err);
           } else {
               //add username and id to resource
               resource.author.id = req.user._id;
               resource.author.username = req.user.username;
               //save resource
               resource.save();
               topic.resources.push(resource);
               topic.save();
               //console.log(resource);
               res.redirect('/topics/' + topic._id);
           }
        });
       }
   });
});

// EDIT ROUTE
router.get('/:resource_id/edit', middleware.checkResourceOwnership, function(req, res){
    Topic.findById(req.params.id).populate("resources").exec(function(err, foundTopic){
        if(err || !foundTopic){
            req.flash('error', 'Topic not found');
            return res.redirect('back');
        } 
        Resource.findById(req.params.resource_id, function(err, foundResource){
            if (err){
                res.redirect('back');
            }else{
                res.render('resources/edit', {topic_id: req.params.id, resource:foundResource});
            }
        });
    });
});

// UPDATE ROUTE
router.put('/:resource_id', middleware.checkResourceOwnership, function(req, res){
    Resource.findByIdAndUpdate(req.params.resource_id, req.body.resource, function(err, updatedResource){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('/topics/' + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete('/:resource_id', middleware.checkResourceOwnership, function(req, res){
    Resource.findByIdAndRemove(req.params.resource_id, function(err){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('/topics/' + req.params.id);
        }
    });
});




module.exports = router;



