document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#profile').addEventListener('click', clickedprofile);
    document.querySelector('#post-form').onsubmit = make_post;
    document.querySelector('#all-posts-link').addEventListener('click', get_posts);

    //clear post fields
    document.querySelector('#all-posts').style.display = 'none';
   


    
  });

function load_index(){
    fetch('')
}

function clickedprofile(){
    //history.pushState('profile', "", "profile");
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


function get_posts(){
    document.querySelector('#all-posts').innerHTML = '';
    document.querySelector('#all-posts').style.display = 'block';
    fetch('/Allposts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        posts.forEach(post => {
            const element = document.createElement('div');
            const card_header = document.createElement('div');
            const card_body = document.createElement('div');

            card_body.classList.add('card-body');
            card_header.classList.add('card-header');

            card_body.innerHTML = `<h5>${post.post}</h5>`;
            card_header.innerHTML = `${post.user_post}`;

            card_body.innerHTML += `<button>Like</button>`;
            card_body.innerHTML += `<button>Comment</button>`;

            element.classList.add('card');
            element.append(card_header);
            element.append(card_body);
            
            document.querySelector('#all-posts').append(element);


        })
    });
}