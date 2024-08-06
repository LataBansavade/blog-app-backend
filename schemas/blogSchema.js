const mongoose = require('mongoose')
const Schema = mongoose.Schema


const blogSchema = new Schema({
    title:{
        type : 'string',
        required: true,
        trim : true,
        minLength : 3,
        maxLength : 100,
    },
    textBody:{
        type : 'string',
        required: true,
        trim : true,
        minLength : 3,
        maxLength : 1000,
    },
    creationDateTime:{
        type: 'string',
        required: true,
    },
    userId:{
        type:Schema.Types.ObjectId, // FK to user table
        required: true,
        ref: 'User'
    },
    isDeleted : {
        type : Boolean,
        default : false,
    },
    deletionDateTime :{
        type : Date,
        required: false,
    }

}) 

module.exports = mongoose.model('blog',blogSchema)