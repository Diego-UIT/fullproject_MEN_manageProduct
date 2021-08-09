function cart(cartOld) {
  this.items = cartOld.items || []
  this.priceTotal = cartOld.priceTotal || 0

  this.add = (product, id, imageSrc) => {
    const index = this.items.findIndex(s => s.id === id)
    if (index < 0) {
      this.items.push({id: id, qty: 1, item: product, imageSrc})
    } else {
      this.items[index].qty++
    }
    //console.log(product.price)
    this.priceTotal += product.price
  }

  this.delete = (id) => {
    const index = this.items.findIndex(s => s.id === id)
    this.priceTotal -= this.items[index].item.price * this.items[index].qty
    this.items.splice(index, 1)
  }

  this.reduce = (id) => {
    const index = this.items.findIndex(s => s.id === id)
    this.priceTotal -= this.items[index].item.price
    this.items[index].qty--
    if(this.items[index].qty <= 0){
      this.items.splice(index, 1)
    }
  }

  this.increase = (id) => {
    const index = this.items.findIndex(s => s.id === id)
    this.priceTotal += this.items[index].item.price
    this.items[index].qty++
  }
}

module.exports = cart

