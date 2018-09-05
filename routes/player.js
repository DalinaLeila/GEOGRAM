const express = require('express')
const player = express.Router()
const User = require('../models/User')
const Game = require('../models/Game')
const Task = require('../models/Task')
const ensureLogin = require('connect-ensure-login')
const { upload } = require('../utils/cloudinary')
const fs = require('fs')

player.get('/player-overview', (req, res) => {
    Game.find({}).then(game => {
        res.render('player/player-overview', { game })
    })
})





//search for games

player.post('/find-game', (req, res) => {
    const { code } = req.body;
    User.findById(req.user._id).then(user => {

        if (user.games.indexOf(code)==-1) {

            Game.findById(code).then(game => {
                User.findByIdAndUpdate(req.user._id, { $push: { games: game._id } },
                    { new: true }).then(
                        user => {

                            User.findById(req.user._id)
                                .populate("games")
                                .then(user => {
                                    res.render('player/player-overview', { user })
                                })

                        }
                    )

            }).catch(err => {
                User.findById(req.user._id).populate("games").then(user => {
                    res.render('player/player-overview', { user, message: "Invalid game code!" })
                })


            })


        } else {
            User.findById(req.user._id).populate("games").then(user => {
                res.render('player/player-overview', { user, message: "Game already displayed!" })
            })
        }
    })


})


player.get('/game/:id', ensureLogin.ensureLoggedIn(), (req, res) => {
    const id = req.params.id

    Game.findById(id).then(game => {
        res.render('player/game', { game })
    })
})

player.get('/player-task/:id', ensureLogin.ensureLoggedIn(), (req, res) => {
    const id = req.params.id
    let tasks = []

    Game.findById(id)
        .then(game => {
            const taskRefs = game.tasks
            taskRefs.forEach(taskRef => {
                Task.findById(taskRef).then(task => {
                    // task.sort(task.order)
                    console.log(task) //returns obj
                    tasks.push(task)
                })
            })
        })
        .then(() => {
            // console.log('TASKS: ', tasks) //returns empty array???
            res.render('player/player-task', { tasks })
        })
})

player.post('/player-task/:id', (req, res, next) => {
    const id = req.params.id
    const { file } = req.files
    // const { name } = req.body
    const path = `public/uploads/${file.name}`

    file.mv(path, function (err) {
        if (err) return res.status(500).send(err)

        //uploads to cloudinary
        upload(path)
            .then(result => {
                // console.log('RESUOLT', result)
                // console.log('REQ>BODY: ', req.body.file)
                return Task.findByIdAndUpdate(id, { file: req.body.file }, { new: true, upsert: true })
            })
            .then(task => {
                //deletes local copy
                fs.unlinkSync(path)
                res.send(task)
            })
    })
    // res.redirect('/player/player-task/:id', { id })
    res.redirect('back')
})

player.get('/finished', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('player/game-finished')
})

module.exports = player
