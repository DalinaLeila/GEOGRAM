const express = require('express')
const router = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
    res.render('auth/login')
})

// router.get('/success', ensureLogin.ensureLoggedIn(), (req, res, next) => {
//     res.render('index')
// })

// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//     res.render("passport/private", { user: req.user });
//   });

module.exports = router
