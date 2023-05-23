var favorite = document.getElementsByClassName("fa-heart");
var trash = document.getElementsByIdName("trash");

var buy = document.querySelector("#purchase")



Array.from(favorite).forEach(function(element) {
      element.addEventListener('click', function(e){
        const _id = e.target.dataset.id
        console.log(_id)
        fetch('save', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            _id
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(e){
    const _id = e.target.dataset.id
    console.log(_id)
    fetch('save', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        _id
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});



  // Function to calculate and update the total price
  function updateTotalPrice() {
    const cartItems = document.querySelectorAll('#card');
    let totalPrice = 0;
    
    cartItems.forEach((item) => {
      const priceElement = item.querySelector('.card-text');
      const price = parseFloat(priceElement.innerText.replace('$', ''));
      totalPrice += price;
    });

    const totalPriceElement = document.getElementById('totalPrice');
    totalPriceElement.innerText = totalPrice.toFixed(2);
  }

  // Event listener for changes in the cart
  window.addEventListener('DOMContentLoaded', () => {
    // Call the updateTotalPrice function initially to set the initial total price
    updateTotalPrice();

    // Listen for changes in the cart items
    const cartItems = document.querySelectorAll('#card');
    cartItems.forEach((item) => {
      const observer = new MutationObserver(updateTotalPrice);
      observer.observe(item, { childList: true });
    });
  });




