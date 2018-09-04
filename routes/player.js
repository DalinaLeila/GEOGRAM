const express = require('express')
const player = express.Router()
const User = require('../models/User')
const Game = require('../models/Game')
const Task = require('../models/Task')
const ensureLogin = require('connect-ensure-login')
const { upload } = require('../utils/cloudinary')

player.get('/player-overview', (req, res) => {
    Game.find({}).then(game => {
        res.render('player/player-overview', { game })
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

    Game.findById(id).then(game => {
        let tasks = []
        const taskRefs = game.tasks

        taskRefs.forEach(taskRef => {
            Task.findById(taskRef).then(task => {
                // console.log(task)    //returns obj
                tasks.push(task)
            })
        })
        res.render('player/player-task', { tasks })
    })

    // .then(el => {
    //     console.log(tasks) //empty array
    //     res.render('player/player-task', { task })
    // })
})

player.post('/player-task/:id', (req, res, next) => {
    // const id = req.params.id
    // console.log(req.files)
    // const { file } = req.files
    // // const { name } = req.body
    // const path = `public/uploads/${file.name}`
    // file.mv(path, function(err) {
    //     if (err) return res.status(500).send(err)
    //     let taskId
    //     Task.findByIdAndUpdate(
    //         id,
    //         {
    //             file: result.url
    //         },
    //         { new: true }
    //     ).then(result => {
    //         return upload(path) //????
    //         res.send(result)
    //     })
    // })
})

player.get('/finished', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('player/game-finished')
})

module.exports = player
