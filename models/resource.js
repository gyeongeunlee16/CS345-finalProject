var mongoose = require("mongoose");

var resourceSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    likes_count: Number,
    
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Resource", resourceSchema);


