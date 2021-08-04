const express = require('express')
const productModel = require('../models/product.model')
const categoryModel = require('../models/category.model')
const router = express.Router()

router.get('/', async(req, res) => {
    try {
        const products = await productModel.find().populate('category',['name'])
        console.log(products)
        res.render('products/list', {products: products})
    } catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Add product
router.get('/add', async(req, res) => {
    const product = new productModel()
    const categories = await categoryModel.find()
    res.render('products/add', {product: product, categories: categories})
})

router.post('/', async(req, res) => {
    try {
        const productNew = new productModel({
            name: req.body.name,
            information: req.body.information,
            quantity: req.body.quantity,
            price: req.body.price,
            category: req.body.category
        })
        await productNew.save()
        res.redirect('/product')
    } catch(e) {
        console.log(e.message)
        res.redirect('/')
    }
})

// Edit product
router.get('/edit/:id', async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        const categories = await categoryModel.find()
        res.render('products/edit', {product: product, categories: categories})
    } catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

router.put('/edit/:id', async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        product.name = req.body.name,
        product.information = req.body.information,
        product.quantity = req.body.quantity,
        product.price = req.body.price,
        product.category = req.body.category
        await product.save()
        res.redirect('/product')
    }
    catch(e) {
        console.log(e)
        res.redirect('/')
    }
})

// Delete product
router.delete('/delete/:id', async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.redirect('/product')
    }
    catch(e) {
        console.log(e.message)
        res.redirect('/')
    }
})

module.exports = router