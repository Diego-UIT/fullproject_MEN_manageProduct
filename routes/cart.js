const express = require('express')
const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const router = express.Router()

router.get('/', (req, res) => {
    try {
        let carts = []
        let priceTotal = 0
        if (req.session.cart) {
            carts = req.session.cart.items
            priceTotal = req.session.cart.priceTotal
        }
        res.render('carts/cart', {carts: carts, priceTotal: priceTotal})
    } catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Add Cart
router.get('/add/:id', async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        const cart = new cartModel(req.session.cart ? req.session.cart : {items: []})
        cart.add(product, req.params.id, product.imageSrc)
        req.session.cart = cart
        res.send('Add success!')
    } catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Reduce Cart
router.get('/reduce/:id', (req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        cart.reduce(req.params.id)
        req.session.cart = cart
        res.redirect('/cart')
    }
    catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Increase Cart
router.get('/increase/:id', (req, res) => {
    try {
        const id = req.params.id
        const cart = new cartModel(req.session.cart)
        cart.increase(id)
        req.session.cart = cart
        res.redirect('/cart')
    }
    catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Delete Cart
router.post('/:id',(req,res)=>{
    try{
        const id=req.params.id
        const cart=new cartModel(req.session.cart)
        cart.delete(id)
        req.session.cart=cart 
        res.redirect('/cart')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

module.exports = router



