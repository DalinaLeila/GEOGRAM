const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')

passport.use(
    new LocalStrategy((email, password, next) => {
        User.findOne({ email }, (err, foundUser) => {
            console.log('email ', email)
            if (err) {
                next(err)
                return
            }

            if (!foundUser) {
                next(null, false, { message: 'Incorrect email' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                next(null, false, { message: 'Incorrect password' })
                return
            }

            next(null, foundUser)
        })
    })
)
