var favorite = document.getElementsByClassName("fa-heart");
var trash = document.getElementsByIdName("trash");

var buy = document.querySelector("#purchase")


buy.addEventListener('click',() => {
  console.log('buy')
  // fetch('/create-checkout-session', {
  //   method:'POST',
  //   headers: {
  //       'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     id: _id,
  //     }),
  //   })
  //   .then(response => {
  //     if (response.ok) return response.json()
  //     return response.json().then(json => Promise.reject(json))
  //   })
  //   .then(({ url }) =>{
  //       window.location = url
  //   }).catch(e =>{
  //       console.error(e.error)
  //   })
})

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


