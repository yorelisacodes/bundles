var favorite = document.getElementsByClassName("fa-heart");
var trash = document.getElementsByClassName("fa-trash");

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


