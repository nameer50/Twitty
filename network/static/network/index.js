document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#profile').addEventListener('click', clickedprofile);
    document.querySelector('#post-form').onsubmit = make_post;
    document.querySelector('#all-posts-link').addEventListener('click', get_posts);

    //clear post fields
    document.querySelector('#all-posts').style.display = 'none';
   
  });

function load_index(){
    
    fetch('');
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


function get_posts(event){
    event.preventDefault();
    document.querySelector('#all-posts').innerHTML = '';
    document.querySelector('#all-posts').style.display = 'block';

    list = [];

    

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
            card_header.innerHTML += ' ' + ' ' + `${post.time}`;

            fetch(`/liked/${post.id}`)
            .then(response => response.json())
            .then(result => {
                if (result['error'] == 'like object does not exist'){
                    card_body.innerHTML += `<button id="like" data-post="${post.id}">Like</button>`;
                    document.querySelectorAll('#like').forEach( el => {
                        el.addEventListener('click', liked_post);
                    });
                    
                }
                else{
                    card_body.innerHTML += `<button id="unlike" data-post="${post.id}">unlike</button>`;
                    document.querySelectorAll('#unlike').forEach( el => {
                        el.addEventListener('click', liked_post);
                    });
                }
            });

            card_body.innerHTML += `<button id="comment">Comment</button>`;
            element.classList.add('card');
            element.append(card_header);
            element.append(card_body);
            document.querySelector('#all-posts').append(element);
        });
    });
   
}

function liked_post(event){
    if (event.target.id == 'like'){
    fetch('/Allposts', {
        method: 'PUT',
        body: JSON.stringify({
            post : event.target.dataset.post
        }),

    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result['sucess'] == 'liked'){
            event.target.innerHTML = 'unlike';
            event.target.setAttribute('id', 'unlike');
        }
    })
}
else{
    //GONNA DELETE THE LIKE AND SET THE INNER HTML OF THE TARGET TO LIKE COOL BROOO
    fetch('/Allposts', {
        method: 'POST',
        body: JSON.stringify({
            post : event.target.dataset.post
        }),

    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        if (result['sucess'] == 'unliked'){
            event.target.innerHTML = 'like';
            event.target.setAttribute('id', 'like');
        }
    })
}

    
}



