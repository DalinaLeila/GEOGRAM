const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        googleId: String,
        createdGames: [Schema.Types.ObjectId],
        games: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Game',
            },
        ],
        progress: [
            {
                game: {
                    type: Schema.Types.ObjectId,
                    ref: 'Game',
                },
                finished: {
                    type: Boolean,
                    default: false,
                },
                steps: [
                    {
                        task: {
                            type: Schema.Types.ObjectId,
                            ref: 'Task',
                        },
                        time: Date,
                        file: String,
                    },
                ],
            },
        ],
    },
    {
        usePushEach: true,
    }
)

module.exports = mongoose.model('User', userSchema)
