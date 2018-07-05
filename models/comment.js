const mongoos = require('mongoose');
const commentSchema = mongoos.Schema({
   text: String,
   author: {
       id: {
           type: mongoos.Schema.Types.ObjectId,
           ref: "User"
       },
       username: String
   }
});
module.exports = mongoos.model("Comment", commentSchema);