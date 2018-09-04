const express = require('express')
const player = express.Router()
const User = require('../models/User')
const Game = require('../models/Game')
const Task = require('../models/Task')
const ensureLogin = require('connect-ensure-login')

player.get('/overview', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('player/player-overview')
})

player.get('/task', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('player/player-task')
})

player.get('/finished', ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render('player/game-finished')
})

module.exports = player
