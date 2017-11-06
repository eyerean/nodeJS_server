const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define the user model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

//On save hook, encrypt password
userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    if(err) throw err;

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if(err) throw err;

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) throw err;
    
    callback(null, isMatch);
  })
};


//Create the model classe
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;
