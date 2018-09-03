const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    taskType: {
        type: String,
        enum: ["text", "photo", "video", "audio"],
        dafault: "text",
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Task', taskSchema)