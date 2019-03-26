// all middleware goes here
var Course = require("../models/course");
var Topic = require("../models/topic");

var middlewareObj = {};

middlewareObj.checkCourseOwnership = function (req, res, next){
    //if user logged in?
    if(req.isAuthenticated()){
        Course.findById(req.params.id, function(err, foundCourse){
            if (err || !foundCourse){
                req.flash('error', 'Course not found');
                return res.redirect('/courses');
            }else{
                
                //does user own the post?
                if (foundCourse.author.id.equals(req.user._id)){
                    next();
                //otherwise, redirect
                }else{
                    req.flash('error', 'You do not have permission to do that');
                    return res.redirect('back');
                }
            }
                
            
        });
    //if not, redirect
    }else{
        res.redirect('back');
    }
};

middlewareObj.checkTopicOwnership = function(req, res, next){
    //if user logged in?
    if(req.isAuthenticated()){
        Topic.findById(req.params.Topic_id, function(err, foundTopic){
            if (err){
                req.flash('error', 'Topic not found');
                return res.redirect('/Courses');
            }else{
                
                //does user own the Topic?
                if (foundTopic.author.id.equals(req.user._id)){
                    next();
                //otherwise, redirect
                }else{
                    req.flash('error', 'You do not have permission to do that');
                    return res.redirect('back');
                }
            }
            
        });
    //if not, redirect
    }else{
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please log in first!');
    return res.redirect("/login");
};

module.exports = middlewareObj

