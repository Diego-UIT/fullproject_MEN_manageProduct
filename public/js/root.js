document.getElementById('year').innerHTML = new Date().getFullYear()
const root = location.protocol + '//' + location.host

$('.addToCart').click(function(event){
    event.preventDefault()
    const href = this.href
    $.ajax({
        url:href,
        type:'GET',
        data:{},
        success:function(data){
          swal(data, 'continue buy!', 'success')
          $('#numberCart').load(root + ' #numberCart2')
        }
      })
})

$('.increaseCart').on('submit', function(event){
    event.preventDefault()
    const action = $(this).attr('action')
    const id = $(this).data('id')
    const qty2 = '#qty2' + id

    $.ajax({
        url:action,
        type:'PUT',
        data:{},
        success:function(){
          $('#total1').load(root + '/cart #total2')
          $('#qty'+id).load(root + '/cart ' + qty2)
          $('#numberCart').load(root + ' #numberCart2')
        }
      })
})

$('.reduceCart').on('submit', function(event){
    event.preventDefault()
    const action = $(this).attr('action')
    const id = $(this).data('id')
    const qty2 = '#qty2' + id
    const tr_cart_id = '#tr_cart_'+ id

    $.ajax({
        url:action,
        type:'PUT',
        data:{},
        success:function(){
          $('#total1').load(root + '/cart #total2')
          $('#qty' + id).load(root + '/cart ' + qty2)
          $('#numberCart').load(root + ' #numberCart2')
          if ($(qty2).text() === '1') {
            $(tr_cart_id).empty()
          }
        }
      })
})

$('.deleteCart').on('submit', function(event) {
  event.preventDefault()
  const action = $(this).attr('action')
  const href = root + action
  const tr_cart_id = '#tr_cart_'+ $(this).data('id')
  
  $.ajax({
      url:href,
      type:'DELETE',
      data:{},
      success:function(data){
          swal(data, 'success')
          $('#total1').load(root + '/cart #total2')
          $(tr_cart_id).empty()
          $('#numberCart').load(root + ' #numberCart2')
      }
    })
})

const carts = ['banana', 'apple', 'orange']
carts.map(cart => {
  console.log(carts.length)
})