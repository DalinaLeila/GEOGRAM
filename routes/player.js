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
                    // console.log(task) //returns obj
                    tasks.push(task)
                })
            })
        })
        .then(() => {
            // console.log(tasks)   //returns empty array???
            //***how to only show current task????***
            res.render('player/player-task', { tasks })
        })
})

player.post('/player-task/:id', (req, res, next) => {
    const id = req.params.id
    const { file } = req.files
    // const { name } = req.body
    const path = `public/uploads/${file.name}`

    file.mv(path, function(err) {
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
})

player.get('/finished', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('player/game-finished')
})

module.exports = player
