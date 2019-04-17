var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
   name: String,
   description: String,
   code: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   replies: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Reply"
      }
   ]
});

module.exports = mongoose.model("Question", questionSchema);
