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
                    card_body.innerHTML += `<button id="like" data-post="${post.id}">Like: ${post.likes}</button>`;
                    document.querySelectorAll('#like').forEach( el => {
                        el.addEventListener('click', liked_post);
                    });
                    
                }
                else{
                    card_body.innerHTML += `<button id="unlike" data-post="${post.id}">Unlike: ${post.likes}</button>`;
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
    fetch('/Allposts', {
        method: 'PUT',
        body: JSON.stringify({
            post : event.target.dataset.post,
            type : event.target.id
        }),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        const likes = result['likes']
        if (result['sucess'] == 'liked'){
            
            event.target.innerHTML = `Unlike: ${likes}`;
            event.target.setAttribute('id', 'unlike');
        }
        else if (result['sucess'] == 'unliked'){
            
            event.target.innerHTML = `Like: ${likes}`;
            event.target.setAttribute('id', 'like');
        }
    });

}



