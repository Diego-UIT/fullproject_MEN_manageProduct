const express = require('express')
const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const router = express.Router()

router.get('/', (req, res) => {
    try {
        let carts = []
        if (req.session.cart) {
            carts = req.session.cart.items
        }
        res.render('carts/cart', {carts: carts})
    } catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Add Cart
router.get('/add/:id', async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        let itemsOld = []
        if (req.session.cart) {
            itemsOld = req.session.cart.items
        }
        const cart = new cartModel(itemsOld)
        cart.add(product, req.params.id, product.imageSrc)
        req.session.cart = cart
        res.redirect('/cart')
    } catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Reduce Cart
router.put('/reduce/:id', (req, res) => {
    try {
        let itemsOld = []
        if (req.session.cart) {
            itemsOld = req.session.cart.items
        }
        const cart = new cartModel(itemsOld)
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
router.put('/increase/:id', (req, res) => {
    try {
        let itemsOld = []
        if (req.session.cart) {
            itemsOld = req.session.cart.items
        }
        const cart = new cartModel(itemsOld)
        cart.increase(req.params.id)
        req.session.cart = cart
        res.redirect('/cart')
    }
    catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Delete Cart
router.delete('/delete/:id', (req, res) => {
    let itemsOld = []
        if (req.session.cart) {
            itemsOld = req.session.cart.items
        }
    const cart = new cartModel(itemsOld)
    cart.delete(req.params.id)
    req.session.cart = cart
    res.redirect('/cart')
})

module.exports = router



