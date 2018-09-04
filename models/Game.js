const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    tasks: [{type: Schema.Types.ObjectId, ref: "Task"}],
    private: {
        type: Boolean,
        default: false
    },
    description: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    }
})

module.exports = mongoose.model('Game', gameSchema)