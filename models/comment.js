const mongoos = require('mongoose');
const commentSchema = mongoos.Schema({
   text: String,
   author: String 
});
module.exports = mongoos.model("Comment", commentSchema);