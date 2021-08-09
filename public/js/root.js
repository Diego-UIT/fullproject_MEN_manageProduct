document.getElementById('year').innerHTML = new Date().getFullYear()
const root = location.protocol + "//" + location.host

$('.addToCart').click(function(event){
    event.preventDefault()
    const href = this.href
    $.ajax({
        url:href,
        type:'GET',
        data:{},
        success:function(data){
          swal(data, "continue buy!", "success")
          $("#numberCart").load(root + " #numberCart2")
        }
      })
})

$('.increaseCart').click(function(event){
    event.preventDefault()
    const href = this.href
    const id = this.id
    const qty2 = "#qty2" + id
    console.log(id)

    $.ajax({
        url:href,
        type:'GET',
        data:{},
        success:function(){
          swal("Increase successful!", "continue!", "success")
          $("#total1").load(root + "/cart #total2")
          $("#qty"+id).load(root + "/cart " + qty2)
        }
      })
})

$('.reduceCart').click(function(event){
    event.preventDefault()
    const href = this.href
    const id = this.id
    const qty2 = "#qty2" + id
    $.ajax({
        url:href,
        type:'GET',
        data:{},
        success:function(){
          swal("Reduce successful!", "continue!", "success")
          $("#total1").load(root + "/cart #total2")
          $("#qty"+id).load(root + "/cart " + qty2)
        }
      })
})

$('.deleteCart').on("submit", function(event) {
  event.preventDefault()
  const action = $(this).attr('action')
  const href = root + action
  const tr_cart_id = "#tr_cart_"+ $(this).data("id")
  
  $.ajax({
      url:href,
      type:'POST',
      data:{},
      success:function(){
          console.log("delete ok")
          swal("Delete successful!", "continue!", "success")
          $("#total1").load(root + "/cart #total2")
          $(tr_cart_id).empty()
      }
    })
})