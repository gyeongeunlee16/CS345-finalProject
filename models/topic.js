var mongoose = require("mongoose");

var topicSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    resouces: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Resource"
      }
   ]
});

module.exports = mongoose.model("Topic", topicSchema);

