const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Banh Trang'},
    information: { type: String, default: 'Rau cu tuoi sach'},
    price: { type: Number, default: 20000},
    quantity: { type: Number, default: 5},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
  }, {timestamps: true});

module.exports = mongoose.model('product', productSchema)