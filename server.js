const express = require('express')
var expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
const userRouter = require('./routes/user')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
require('./models/passport.model')(passport)
const app = express()
const port = process.env.PORT || 3000

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60*60*1000 }
  }))
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})
app.use(flash())
   
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/layout')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false, limit: '10mb' }))
app.use(passport.initialize());
app.use(passport.session());

const connectFunction = async() => {
    try {
        await mongoose.connect(process.env.PORT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        console.log('Connect database successfully!')
    }
    catch(e) {
        console.log(e)
        console.log('Connect database failed!')
    }
}
connectFunction()


app.use('/', indexRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/user', userRouter)

console.log('Server ok!')

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
  })

