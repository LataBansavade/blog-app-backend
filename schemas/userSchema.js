const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name:{
    type : 'string'
  },
  email :{
    type :'string',
    required : true,
    unique : true
  },
  username :{
    type :'string',
    required : true,
    unique : true,
    minLength : 3,
    maxLength : 50
  },
  password :{
    type :'string',
    required : true,
    select : false
  },
  country :{
    type :'string',
    default : "India"
  }

})
module.exports = mongoose.model('user',userSchema)