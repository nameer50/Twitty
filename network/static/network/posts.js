document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#post-text').value = '';

    document.querySelectorAll('#like').forEach(el => {
        el.addEventListener('click', liked_post);
    });

    document.querySelectorAll('#unlike').forEach(el => {
        el.addEventListener('click', liked_post);
    });

    document.querySelector('#post-form').onsubmit = make_post;
  });

  function liked_post(event){
    fetch('/liked', {
        method: 'POST',
        body: JSON.stringify({
            post : event.target.dataset.post,
            type : event.target.id
        }),
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        const likes = result['likes']
        if (result['success'] == 'liked'){
            
            event.target.innerHTML = `Unlike: ${likes}`;
            event.target.setAttribute('id', 'unlike');
        }
        else if (result['success'] == 'unliked'){
            
            event.target.innerHTML = `Like: ${likes}`;
            event.target.setAttribute('id', 'like');
        }
    });
}

    function make_post(event){
        event.preventDefault();
        fetch('/posts', {
            method: 'POST',
            body : JSON.stringify({
                post: document.querySelector('#post-text').value
            }),
        })
        .then(response => response.json())
        .then(result => {
            console.log(result['success']);

            const post = result['success'];

            const new_post = document.createElement('div');
            const card_header = document.createElement('div');
            const card_body = document.createElement('div');

            new_post.classList.add('card');
            card_header.classList.add('card-header');
            card_body.classList.add('card-body');

            card_header.innerHTML = `${post.user_post}<br>${post.time}`;
            card_body.innerHTML = `<h5 class='card-title'>${post.post}</h5>`;
            card_body.innerHTML += `<button id='like' class='btn btn-primary' data-post=${post.id}>Like: 0</button> <button class='btn btn-primary'>Comment</button>`;
            
            new_post.append(card_header);
            new_post.append(card_body);

            document.querySelector('#all-posts').prepend(new_post);

            document.querySelectorAll('#like').forEach(el => {
                el.addEventListener('click', liked_post);
            });



           

        })


        //Clear out the post-text field
        
        document.querySelector('#post-text').value = '';
    }