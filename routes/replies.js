var express = require("express");
var router  = express.Router({mergeParams: true});
var Question = require("../models/question");
var Reply = require("../models/reply");
var middleware = require('../middleware');

//Replies Create
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup question using ID
   Question.findById(req.params.id, function(err, question){
       if(err){
           console.log(err);
           res.redirect("/questions");
       } else {
        Reply.create(req.body.reply, function(err, reply){
           if(err){
               console.log(err);
           } else {
               //add username and id to reply
               reply.author.id = req.user._id;
               reply.author.username = req.user.username;
               //save reply
               reply.save();
               question.replies.push(reply);
               question.save();
               //console.log(question);
               res.redirect('/questions/' + question._id);
           }
        });
       }
   });
});



//Replies New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find question by id
    //console.log(req.params.id);
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
        } else {
             res.render("replies/new", {question: question});
        }
    })
});


/*
// SHOW - shows more info about one Reply, which is its resources
router.get("/:reply_id", middleware.isLoggedIn,function(req, res){
    //find the reply with provided ID
    //populate is very important in order to link reply to its resources
    Reply.findById(req.params.reply_id).populate("resources").exec(function(err, foundReply){
        if(err || !foundReply){
            req.flash('error', 'Reply not found');
            res.redirect('back');
        } else {
            //console.log("show more info reply is working!!")
            //render show template with that question
            //console.log(foundReply);
            //console.log("Reply is", foundReply);
            //foundReply.resources.forEach(function(resource){ 
            //  console.log("Resource is ", resource);
            //});
                        
            
            res.render("replies/show", {reply: foundReply});
        }
    });
});
*/

// EDIT ROUTE
router.get('/:reply_id/edit', middleware.checkReplyOwnership, function(req, res){
    Question.findById(req.params.id).populate("replies").exec(function(err, foundQuestion){
        if(err || !foundQuestion){
            req.flash('error', 'Question not found');
            return res.redirect('back');
        } 
        Reply.findById(req.params.reply_id, function(err, foundReply){
            if (err){
                res.redirect('back');
            }else{
                res.render('replies/edit', {question_id: req.params.id, reply:foundReply});
            }
        });
    });
});

// UPDATE ROUTE
router.put('/:reply_id', middleware.checkReplyOwnership, function(req, res){
    Reply.findByIdAndUpdate(req.params.reply_id, req.body.reply, function(err, updatedReply){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('/questions/' + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete('/:reply_id', middleware.checkReplyOwnership, function(req, res){
    Reply.findByIdAndRemove(req.params.reply_id, function(err){
        if (err){
            res.redirect('back');
        }else{
            res.redirect('/questions/' + req.params.id);
        }
    });
});



module.exports = router;

