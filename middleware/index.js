// all middleware goes here
var Course = require("../models/course");
var Topic = require("../models/topic");
var Resource = require("../models/resource");


//Forum added
var Question = require("../models/question");
var Reply = require("../models/reply");

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
        Topic.findById(req.params.topic_id, function(err, foundTopic){
            if (err){
                req.flash('error', 'Topic not found');
                return res.redirect('/courses');
            }else{
                
                //does user own the topic?
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

middlewareObj.checkResourceOwnership = function(req, res, next){
    //if user logged in?
    if(req.isAuthenticated()){
        Resource.findById(req.params.resource_id, function(err, foundResource){
            if (err){
                req.flash('error', 'Resource not found');
                return res.redirect('/courses');
            }else{
                
                //does user own the resource?
                if (foundResource.author.id.equals(req.user._id)){
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



/*Forum Added*/
middlewareObj.checkQuestionOwnership = function (req, res, next){
    //if user logged in?
    if(req.isAuthenticated()){
        Question.findById(req.params.id, function(err, foundQuestion){
            if (err || !foundQuestion){
                req.flash('error', 'Question not found');
                return res.redirect('/questions');
            }else{
                
                //does user own the post?
                if (foundQuestion.author.id.equals(req.user._id)){
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



middlewareObj.checkReplyOwnership = function(req, res, next){
    //if user logged in?
    if(req.isAuthenticated()){
        Reply.findById(req.params.reply_id, function(err, foundReply){
            if (err){
                req.flash('error', 'Reply not found');
                return res.redirect('/courses');
            }else{
                
                //does user own the reply?
                if (foundReply.author.id.equals(req.user._id)){
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
    
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
};

module.exports = middlewareObj

