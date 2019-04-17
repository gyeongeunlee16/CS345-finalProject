var express = require("express");
var router  = express.Router({mergeParams: true});
var Topic = require("../models/topic");
var Resource = require("../models/resource");
var Course = require("../models/course");
var middleware = require('../middleware');

//Resources Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup topic using ID
   Topic.findById(req.params.id, function(err, topic){
       if(err){
           console.log(err);
           res.redirect("back");
       } else {
        Resource.create(req.body.resource, function(err, resource){
           if(err){
               console.log(err);
           } else {
               //add username and id to resource
               resource.author.id = req.user._id;
               resource.author.username = req.user.username;
            
               //save the newly created resource
               resource.save();
               //console.log("resource is", resource);
               //push the newly created resource into topic
               topic.resources.push(resource);
               //save the newly updated topic
               topic.save();
               //res.redirect('/topics/' + topic._id);
               
               //I need to fix this: when add a new resource to current topic, it cannot jump to the topic page
               res.redirect('back'); 
           } 
        });
       }
   });
});




//Resources New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find topic by id
    //console.log(req.params.id);
    //console.log("==============");
  
    Topic.findById(req.params.id, function(err, topic){
        if(err){
            console.log(err);
        } else {
            res.render("resources/new", {topic: topic});
            }
        })
 
});


/*
// SHOW - shows more info about one Resource, which is its resources
router.get("/:resource_id", middleware.isLoggedIn,function(req, res){
    //find the resource with provided ID
    Resource.findById(req.params.resource_id, function(err, foundResource){
        if(err || !foundResource){
            req.flash('error', 'Resource not found');
            res.redirect('back');
        } else {
            //console.log("show more info resource is working!!")
            //render show template with that topic
            res.render("resources/show", {resource: foundResource});
        }
    });
});
*/

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

//Notice the difference between this UPDATE route and the UPDATE route for topic
//Cannot go back to TOPIC page because it requires COURSE ID to show TOPIC page
// UPDATE ROUTE
router.put('/:resource_id', middleware.checkResourceOwnership, function(req, res){
    Resource.findByIdAndUpdate(req.params.resource_id, req.body.resource, function(err, updatedResource){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('back');
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete('/:resource_id', middleware.checkResourceOwnership, function(req, res){
    Resource.findByIdAndRemove(req.params.resource_id, function(err){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('back');
        }
    });
});



module.exports = router;


