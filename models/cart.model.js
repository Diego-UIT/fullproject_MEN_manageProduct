function cart(itemsOld) {
  this.items = itemsOld || []
  this.priceTotal = 0

  this.add = function(product, id, imageSrc) {
    const index = this.items.findIndex(s => s.id === id)
    if (index < 0) {
      this.items.push({id: id, qty: 1, item: product, imageSrc})
    } else {
      this.items[index].qty++
    }
  }

  this.delete = function(id) {
    const index = this.items.findIndex(s => s.id === id)
    this.items.splice(index, 1)
  }

  this.reduce = function(id) {
    const index = this.items.findIndex(s => s.id === id)
    this.items[index].qty--
    if (this.items[index].qty <= 0) {
      this.items.splice(index, 1)
    }
  }

  this.increase = function(id) {
    const index = this.items.findIndex(s => s.id === id)
    this.items[index].qty++
  }

  this.totalPrice = function (id) {
    const index = this.items.findIndex(s => s.id === id)
    if (this.items.length < 1) {
      return 0
    } else {
      this.priceTotal = this.items[index].qty * this.items[index].price
    }
  }
}

module.exports = cart

