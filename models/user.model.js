const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    level: 0 // 0: customer, 1: admin
  })

module.exports = mongoose.model('user', userSchema)