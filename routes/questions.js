var express = require("express");
var router  = express.Router();
var Question = require("../models/question");
var middleware = require('../middleware');

//INDEX - show all questions
router.get("/", function(req, res){
    // Get all questions from DB
    Question.find({}, function(err, allQuestions){
       if(err){
           console.log(err);
       } else {
          res.render("questions/index",{questions:allQuestions});
       }
    });
});

//CREATE - add new question to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to questions array
    var name = req.body.name;
    var desc = req.body.description;
    var code = req.body.code;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newQuestion = {name: name, code: code, description: desc, author:author}
    // Create a new question and save to DB
    Question.create(newQuestion, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to questions page
            //console.log(newlyCreated);
            res.redirect("/questions");
        }
    });
});

//NEW - show form to create new question
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("questions/new"); 
});

// SHOW - shows more info about one question
router.get("/:id", function(req, res){
    //find the question with provided ID
    Question.findById(req.params.id).populate("replies").exec(function(err, foundQuestion){
        if(err || !foundQuestion){
            req.flash('error', 'Question not found');
            res.redirect('back');
        } else {
            //console.log(foundQuestion)
            //render show template with that question
            res.render("questions/show", {question: foundQuestion});
        }
    });
});


// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkQuestionOwnership, function(req, res){
    
    Question.findById(req.params.id, function(err, foundQuestion){
        if(err){
            console.log(err);
        }else{
        res.render("questions/edit", {question: foundQuestion});
        };
    });
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkQuestionOwnership, function(req, res){
    // find and update the correct question
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion){
       if(err){
           res.redirect("/questions");
       } else {
           //redirect somewhere(show page)
           res.redirect("/questions/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkQuestionOwnership, function(req, res){
    Question.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/questions');
        }else{
            res.redirect('/questions');
        }
    });
});



module.exports = router;


