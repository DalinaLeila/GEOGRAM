const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    tasks: [Schema.Types.ObjectId],
    private: {
        type: boolean,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    }
})

module.exports = mongoose.model('Game', gameSchema)