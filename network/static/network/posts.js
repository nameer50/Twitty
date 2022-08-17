
document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#post-text').value = '';

    document.querySelectorAll('#like').forEach(el => {
        el.addEventListener('click', liked_post);
    });

    document.querySelectorAll('#unlike').forEach(el => {
        el.addEventListener('click', liked_post);
    });

    document.querySelector('#post-form').onsubmit = make_post;

    document.querySelectorAll('#edit').forEach(el => {
        el.addEventListener('click', edit_post);
    });

    document.querySelectorAll('#show-comments').forEach(el => {
        el.addEventListener('click', show_comments);
    });

  });

function liked_post(event){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/liked', {
        method: 'POST',
        body: JSON.stringify({
            post : event.target.dataset.post,
            type : event.target.id
        }),
        headers: {'X-CSRFToken': csrftoken}
    })

    .then(response => response.json())
    .then(result => {
        
        const likes = result['likes']

        if (result['success'] == 'liked'){
            event.target.innerHTML = `Unlike: ${likes}`;
            event.target.setAttribute('id', 'unlike');
        }
        else if (result['success'] == 'unliked'){
            event.target.innerHTML = `Like: ${likes}`;
            event.target.setAttribute('id', 'like');
        }
        else if (result['error'] == 'need to login'){
            window.location.href = '/login';
        }
    });
}

function make_post(event){
    event.preventDefault();
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('/posts', {
        method: 'POST',
        body : JSON.stringify({
            post: document.querySelector('#post-text').value
        }),
        headers: {'X-CSRFToken': csrftoken}    
    })

    .then(response => response.json())
    .then(result => {

        if (result['success'] == 'posted'){

        const post = result['new_post'];
        const new_post = document.createElement('div');
        new_post.classList.add('card');
        
        new_post.innerHTML = `
        <div class="card-header">
            <a href="profile/${post.user_post}">${post.user_post}</a>
            <br>
            ${post.time}
        </div>
        <div class="card-body">
            <h5 class='card-title'>${post.post}</h5>
            <button id='like' class='btn btn-primary' data-post=${post.id}>Like: 0</button> 
            <button class='btn btn-primary' id="show-comments">Comments: 0</button>
            <button class='btn btn-secondary' id='edit'>Edit</button>
            <form class="mb-3" id="edit-form" style="display: none;">
            <textarea class="form-control" id="edit-text" rows="3"></textarea> 
            <button class="btn btn-primary" id="edit-submit" data-post="${post.id}" type="submit">Save</button>
            </form>
        </div>
        <div id="comments" style="display: none;">  
        </div>
        <div id="new-comment" style="display: none;">
            <button class="btn btn-primary" id="add-comment">Add a comment</button>
            <form class="mb-3" id="comment-form" style="display: none;">
              <textarea class="form-control" id="comment-text" rows="3"></textarea>
              <button class="btn btn-primary" id="comment-submit" data-post=${post.id} type="submit">Comment</button>
            </form>
        </div>`;
        
        document.querySelector('#all-posts').prepend(new_post);
        
        document.querySelectorAll('#like').forEach(el => {
            el.addEventListener('click', liked_post);
        });
        
        document.querySelectorAll('#edit').forEach(el => {
            el.addEventListener('click', edit_post);
        });
        
        document.querySelectorAll('#show-comments').forEach(el => {
            el.addEventListener('click', show_comments);
        });
    }

    });
    document.querySelector('#post-text').value = '';
}

function edit_post(event){
    event.preventDefault();
    const post = event.target.parentNode;
    const form = post.querySelector('#edit-form');
    const submit = form.querySelector('#edit-submit');
    form.style.display = 'block';
    form.querySelector('#edit-text').value = '';
    
    submit.addEventListener('click', (event) => {
        event.preventDefault();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/edit', {
            method: 'PUT',
            body: JSON.stringify({
                post: event.target.dataset.post,
                text: form.querySelector('#edit-text').value
            }),
            headers: {'X-CSRFToken': csrftoken}
        })

        .then(response => response.json())
        .then(result => {

            if (result['error'] == 'no text submitted'){
                form.querySelector('#edit-text').value = '';
                form.style.display = "none";
            }
            else{
                post.querySelector('.card-title').innerHTML = result['post'].post;
                form.querySelector('#edit-text').value = '';
                form.style.display = "none";
                }
            }); 
        });
}

function show_comments(event){
    event.preventDefault();
    const post = event.target.parentNode.parentNode;
    const comments = post.querySelector('#comments');
    const new_comment_div = post.querySelector('#new-comment');
    
    if (comments.style.display == 'none'){
        comments.style.display = 'block';
        new_comment_div.style.display = 'block';
    }
    
    else{
        comments.style.display = 'none';
        new_comment_div.style.display = 'none';
    }
    new_comment_div.querySelector('#add-comment').addEventListener('click', comment);
}

function comment(event){
    event.preventDefault();
    const add_comment_button = event.target;
    const new_comment_form = event.target.parentNode.querySelector('#comment-form');
    const comment_text = new_comment_form.querySelector('#comment-text');
    const comment_div = event.target.parentNode.parentNode.querySelector('#comments');
    const card_body = event.target.parentNode.parentNode.querySelector('.card-body');
    const comment_button = card_body.querySelector('#show-comments');
    
    add_comment_button.style.display = 'none';
    comment_text.value = '';
    new_comment_form.style.display = 'block';
    
    new_comment_form.querySelector('#comment-submit').addEventListener('click', (event) => {
        event.preventDefault();
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/comment', {
            method: 'POST',
            body: JSON.stringify({
                post: event.target.dataset.post,
                comment: comment_text.value
            }),
            headers: {'X-CSRFToken': csrftoken}
        })

        .then(response => response.json())
        .then(result => {

            if (result['success'] == 'commented'){
                comment_div.innerHTML += `
                <div class="card" id="comment">
                    <div class="card-body">
                        <blockquote class="blockquote mb-0">
                            <p>${result['comment']}</p>
                            <footer class="blockquote-footer">${result['user_comment']}</footer>
                        </blockquote>
                    </div>
                </div>`;
                comment_button.innerHTML = `Comments: ${result['comments_amount']}`;
                new_comment_form.style.display = 'none';
                add_comment_button.style.display = 'block';
            }
            else if (result['error'] == 'must be logged in'){
                window.location.href = '/login';
            }
            
        });
        comment_text.value = '';
        
    
        
        
        

    });
}