var express = require("express");
var router  = express.Router({mergeParams: true});
var Course = require("../models/course");
var Topic = require("../models/topic");
var middleware = require('../middleware');

//Topics Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup course using ID
   Course.findById(req.params.id, function(err, course){
       if(err){
           console.log(err);
           res.redirect("/courses");
       } else {
        Topic.create(req.body.topic, function(err, topic){
           if(err){
               console.log(err);
           } else {
               //add username and id to topic
               topic.author.id = req.user._id;
               topic.author.username = req.user.username;
               //save topic
               topic.save();
               course.topics.push(topic);
               course.save();
               //console.log(course);
               res.redirect('/courses/' + course._id);
           }
        });
       }
   });
});



//Topics New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find course by id
    //console.log(req.params.id);
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log(err);
        } else {
             res.render("topics/new", {course: course});
        }
    })
});



// SHOW - shows more info about one Topic, which is its resources
router.get("/:topic_id", middleware.isLoggedIn,function(req, res){
    //find the topic with provided ID
    //populate is very important in order to link topic to its resources
    Topic.findById(req.params.topic_id).populate("resources").exec(function(err, foundTopic){
        if(err || !foundTopic){
            req.flash('error', 'Topic not found');
            res.redirect('back');
        } else {
            //console.log("show more info topic is working!!")
            //render show template with that course
            //console.log(foundTopic);
            //console.log("Topic is", foundTopic);
            //foundTopic.resources.forEach(function(resource){ 
            //  console.log("Resource is ", resource);
            //});
                        
            //This line below keep the url of show page (The resources of one topic)  
            //So that it can return to this url after adding a new resource or edit a current resource
            foundTopic.resources.sort(function(a, b){
                    return parseInt(b.likes_count, 10) - parseInt(a.likes_count, 10)});
            req.session.returnTo = req.originalUrl; 
            res.render("topics/show", {topic: foundTopic});
        }
    });
});


// EDIT ROUTE
router.get('/:topic_id/edit', middleware.checkTopicOwnership, function(req, res){
    Course.findById(req.params.id).populate("topics").exec(function(err, foundCourse){
        if(err || !foundCourse){
            req.flash('error', 'Course not found');
            return res.redirect('back');
        } 
        Topic.findById(req.params.topic_id, function(err, foundTopic){
            if (err){
                res.redirect('back');
            }else{
                
                res.render('topics/edit', {course_id: req.params.id, topic:foundTopic});
            }
            
        });
    });
});

// UPDATE ROUTE
router.put('/:topic_id', middleware.checkTopicOwnership, function(req, res){
    Topic.findByIdAndUpdate(req.params.topic_id, req.body.topic, function(err, updatedTopic){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('/courses/' + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete('/:topic_id', middleware.checkTopicOwnership, function(req, res){
    Topic.findByIdAndRemove(req.params.topic_id, function(err){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('/courses/' + req.params.id);
        }
    });
});



module.exports = router;

