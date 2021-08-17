const express = require('express')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()

router.get('/', async(req, res) => {
    try {
        const users = await userModel.find()
        res.render('users/index', {users: users})
    } catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Add user
router.get('/register', (req, res) => {
    const user = new userModel()
    res.render('users/register', {user: user})
})


router.post('/', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new userModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        await user.save()
        req.flash('success', 'Add user successful!')
        res.redirect('/user')
    } catch(e) {
        req.flash('error', 'Add user failed!')
        console.log(e)
        res.redirect('/')
    }
    res.render('users/profile')
})

router.delete('/delete/:id', async(req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id)
        req.flash('success', 'Delete user successful!')
        res.redirect('/user')
    } catch(e) {
        req.flash('error', 'Delete user failed!')
        console.log(e)
        res.redirect('/')
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login', 
    failureFlash: true
}))

function check(req, res, next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/user/login')
}
router.get('/profile', check, (req, res) => {
    let value = "No name"
    if (req.user) {
        value = req.user.username
    }
    res.render('users/profile', {name: value})
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('login')
})

// Login with google
router.get('/google', passport.authenticate('google', 
{scope: ['profile', 'email']}))

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login', 
    failureFlash: true
}))

// Login with github
router.get('/github', passport.authenticate('github'))

router.get('/github/callback', passport.authenticate('github', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login', 
    failureFlash: true
}))

// Login with facebook
router.get('/facebook', passport.authenticate('facebook'))

router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/login', 
    failureFlash: true
}))


module.exports = router