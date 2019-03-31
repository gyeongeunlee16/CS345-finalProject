var mongoose = require("mongoose");

var topicSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    resources: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Resource"
      }
   ]
});

module.exports = mongoose.model("Topic", topicSchema);

