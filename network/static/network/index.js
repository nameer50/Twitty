document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#profile').addEventListener('click', clickedprofile);
    document.querySelector('#post-form').onsubmit = make_post;

    //clear post fields
   


    
  });

function load_index(){
    fetch('')
}

function clickedprofile(){
    history.pushState('profile', "", "profile");
    fetch('/profile')
    .then(response => response.json())
    .then(profile => {
        console.log(profile);
    });
    
}


function make_post(event){
    event.preventDefault();
    fetch('/post', {
        method:'POST',
        body: JSON.stringify({
            user_post: `${document.querySelector('[name="make-post"]').id}`,
            post: `${document.querySelector('#post-text').value}`
            
        }),  
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    })
    document.querySelector('#post-text').value = '';
    load_index();

}