let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let UserSchema   = new Schema({
  username: String,
  password: String,
  token: String,
  refreshToken: String
});

module.exports = mongoose.model('User', UserSchema);
