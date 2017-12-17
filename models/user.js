const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    displayName: String,
    email: {
        type: String,
        required: false,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    picture: String,
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
});

module.exports = mongoose.model("User", Schema);