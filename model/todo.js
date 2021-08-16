const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Todo', todoSchema)