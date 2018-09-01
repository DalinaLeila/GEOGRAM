const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    inputType: {
        type: String,
        enum: ["text", "photo", "video", "audio"],
        dafault: "text",
    },
    private: {
        type: boolean,
        required: true
    },
})

module.exports = mongoose.model('Task', taskSchema)