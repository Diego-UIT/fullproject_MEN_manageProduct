const localStrategy = require('passport-local').Strategy
const githubStrategy = require('passport-github').Strategy
const googleStrategy = require('passport-google-oauth20').Strategy
const facebookStrategy = require('passport-facebook').Strategy
const userModel = require('./user.model')
const bcrypt = require('bcrypt')

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
      })
       
    passport.deserializeUser(async(id, done) => {
        try {
            const user = await userModel.findById(id)
            return done(null, user)
        } catch(e) {
            return done(e)
        }
    })

    passport.use(new localStrategy(
        { 
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(email, password, done) {
            const user = await userModel.findOne({'email': email}) // Mỗi email chỉ register 1 lần
            console.log(user)
            if (!user) {
                console.log('No user')
                return done(null, false, {message: "No user with that email!"})
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                }
                console.log('Password incorrect')
                return done(null, false, {message: 'Password incorrect!'}) 
            } catch(e) {
                return done(e)
            }
        }
    ))
    
    passport.use(new githubStrategy({
        clientID: '18ea0eb0b6e3d143f6d4',
        clientSecret: 'db53c19cf2a82c32128d78d5bb247ade7bfc49eb',
        callbackURL: 'https://ogani-website-men.herokuapp.com/user/github/callback'
    },
    async function(accessToken, refreshToken, profile, done) {
        //console.log(profile)
        try{
            const user = await userModel.findOne({email:profile._json.email})
            if (user) return done(null,user)

            const newUser = new userModel({
                username: profile._json.name,
                email: profile._json.url,
                password: ''
            })
            await newUser.save()
            return done(null, newUser)
        } catch(e){
            console.log(e)
            return done(e)
        }  
    }))

    passport.use(new googleStrategy({
        clientID: "709867983129-06sptsla4tmp4nr7cggumr0gdtkbsdb5.apps.googleusercontent.com",
        clientSecret: "Z76uEOubiwsRvwO8xuiQ85pI",
        callbackURL: "https://ogani-website-men.herokuapp.com/user/google/callback"
    },
    async function(accessToken, refreshToken, profile, done){
        // console.log(profile)
        try{
            const user = await userModel.findOne({email:profile._json.email})
            if (user) return done(null,user)
            const newUser = new userModel({
                id: profile._json.sub,
                username: profile._json.name,
                email: profile._json.email,
                password: ''
            })
            await newUser.save()
            return done(null, newUser)
        }catch(e){
            console.log(e)
            return done(e)
        }
    }))

    passport.use(new facebookStrategy({
        clientID: "429528125080453",
        clientSecret: "a15a117ef60b56ad83ee989d2bbd7ac4",
        callbackURL: "https://ogani-website-men.herokuapp.com/user/facebook/callback"
    },
    async function(accessToken, refreshToken, profile, done){
        console.log(profile)
        try{
            const user = await userModel.findOne({email:profile._json.email})
            if (user) return done(null,user)
            const newUser = new userModel({
                id: profile._json.id,
                username: profile._json.name,
                email: '',
                password: ''
            })
            await newUser.save()
            return done(null, newUser)
        }catch(e){
            console.log(e)
            return done(e)
        }
    }))
}
