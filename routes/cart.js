const express = require('express')
const cartModel = require('../models/cart.model')
const orderModel = require('../models/order.model')
const productModel = require('../models/product.model')
const paypal = require('paypal-rest-sdk')
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

// Checkout
function check(req, res, next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/user/login')
}

router.get('/checkout', check, (req, res) => {
    if (!req.session.cart) {
        res.redirect('/cart')
    }
    const cart = new cartModel(req.session.cart)
    const total = new Intl.NumberFormat().format(cart.priceTotal)
    res.render('carts/checkout', {products: cart.items, total: total})
})

router.post('/order', check, async(req, res) => {
    try {
        const cart = new cartModel(req.session.cart)
        const order = new orderModel({
            user: req.user,
            cart: cart,
            address: req.body.address
        })
        req.session.cart = null
        req.flash('success', 'Order successfully!')
        await order.save()
        res.redirect('/')
    } catch(e) {
        console.log(e)
        res.redirect('/cart/checkout')
    }
})

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVXWK86mwV_irVithKbwkc9X6y704tXHO6wa3rTRtOWCcJWnSH1SYgKPdsmM13FhtktwnrSz3BalcnKH',
    'client_secret': 'EBdVrHlPeHBAVYbRFCVzq4p9i9PM30TKjDMRkLDmdr1VQuKIEj_Yb_l-p__LU4tGIVm2J8F1tPxpU63c'
  });

router.get('/payment', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/cart/success",
            "cancel_url": "http://localhost:3000/cart/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "20.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "20.00"
            },
            "description": "This is the payment description."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error)
        } else {
            for(let i=0;i<payment.links.length;i++){  
                if(payment.links[i].rel === 'approval_url'){
                   res.redirect(payment.links[i].href)
                }
            }
        }
    });
    
})

router.get('/success',(req,res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    var execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "20.00"
            }
        }]
    }
    
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            req.session.cart = null
            req.flash("success","Paypal successfully")
            res.redirect('/')
        }
    });
})

router.get('/cancel', (req, res)=>{
    res.send("cancel")
})
  
module.exports = router



