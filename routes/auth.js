const express = require('express')
const passport = require('passport')
const authRoutes = express.Router()
const User = require('../models/User')

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

authRoutes.get('/login', (req, res, next) => {
    res.render('auth/login', { message: req.flash('error') })
})

authRoutes.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/auth/login',
        failureFlash: true,
        passReqToCallback: true
    }),
    function(req, res) {
        console.log('req')
        console.log(res)
    }
)

authRoutes.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

authRoutes.post('/signup', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const role = req.body.role
    if (email === '' || password === '') {
        res.render('auth/signup', { message: 'Indicate email and password' })
        return
    }

    User.findOne({ email }, 'email', (err, user) => {
        console.log(email)
        if (user !== null) {
            res.render('auth/signup', { message: 'The email already exists' })
            return
        }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        const newUser = new User({
            email,
            password: hashPass
            // role: 'teacher'
        })

        newUser.save(err => {
            if (err) {
                res.render('auth/signup', { message: 'Something went wrong' })
                console.log(err)
            } else {
                res.redirect('/')
            }
        })
    })
})

authRoutes.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = authRoutes
