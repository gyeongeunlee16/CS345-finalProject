var mongoose = require("mongoose");

var resourceSchema = mongoose.Schema({
    titel: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Resource", resourceSchema);


