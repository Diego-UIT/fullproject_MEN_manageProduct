const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Giường ngủ'},
    information: { type: String, default: 'Nội thất uy tín'},
    price: { type: Number, default: 20000},
    quantity: { type: Number, default: 5},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    imageType: { type: String },
    imageData: { type: Buffer },
  }, {timestamps: true});

productSchema.virtual('imageSrc').get(function() {
  if (this.imageType != null && this.imageData != null)
    return `data: ${this.imageType}; charset=utf-8;base64, ${this.imageData.toString('base64')}`
})

module.exports = mongoose.model('product', productSchema)