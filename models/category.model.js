const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Banh Trang'},
  }, {timestamps: true});

module.exports = mongoose.model('category', categorySchema)