const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({ //ye automatically username ko bhi add ker deta hai yha per jaruret nhi h username define kerne ki
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose);  //ye automatically salt or hashing bhi apne app kerdega

module.exports = mongoose.model('User',userSchema);