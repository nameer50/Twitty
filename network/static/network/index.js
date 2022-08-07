document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#profile').addEventListener('click', clickedprofile);

    
  });


function clickedprofile(){
    fetch('/profile')
    .then(response => response.json())
    .then(profile => {
        console.log(profile);
    });
    
}