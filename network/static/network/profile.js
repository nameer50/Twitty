document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#follow').addEventListener('click', follow);

  });

  function follow(event){
    event.preventDefault();
    fetch('/follow', {
      method: "POST",
      body: JSON.stringify({
        user_toggled_on: event.target.dataset.user,
        type: event.target.id
      }),
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
  }