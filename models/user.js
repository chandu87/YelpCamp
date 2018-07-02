const mongoose = require('mongoose');
const passpotLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passpotLocalMongoose);
module.exports = mongoose.model("User", UserSchema);