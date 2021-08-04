const express = require('express')
var expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index')
const categoryRouter = require('./routes/category')
const productRouter = require('./routes/product')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));

const connectFunction = async() => {
    try {
        await mongoose.connect('mongodb://localhost/manageProduct', {
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

console.log('Server ok!')

app.listen(3000)

