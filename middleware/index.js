// all middleware goes here
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    //if user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground){
                req.flash('error', 'campground not found');
                return res.redirect('/campgrounds');
            }else{
                
                //does user own the post?
                if (foundCampground.author.id.equals(req.user._id)){
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

middlewareObj.checkCommentOwnership = function(req, res, next){
    //if user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                req.flash('error', 'Comment not found');
                return res.redirect('/campgrounds');
            }else{
                
                //does user own the comment?
                if (foundComment.author.id.equals(req.user._id)){
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