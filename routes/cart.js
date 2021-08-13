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
router.put('/reduce/:id', (req, res) => {
    try {
        const id = req.params.id
        const cart = new cartModel(req.session.cart)
        cart.reduce(id)
        req.session.cart = cart
        res.send('Reduce successful!')
    }
    catch(e) {
        console.log(e)
        res.send('Reduce failed!')
    }
})

// Increase Cart
router.put('/increase/:id', (req, res) => {
    try {
        const id = req.params.id
        const cart = new cartModel(req.session.cart)
        cart.increase(id)
        req.session.cart = cart
        res.send('Increase successful!')
    }
    catch(e) {
        console.log(e)
        res.send('Increase failed!')
    }
})

// Delete Cart
router.delete('/:id',(req,res)=>{
    try{
        const id=req.params.id
        const cart=new cartModel(req.session.cart)
        cart.delete(id)
        req.session.cart=cart 
        res.send('Delete successful!')
    }catch(e){
        console.log(e)
        res.send('Delete failed!')
    }
})

module.exports = router



