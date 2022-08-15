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
            const edit_form = document.createElement('form');

            new_post.classList.add('card');
            card_header.classList.add('card-header');
            card_body.classList.add('card-body');
            edit_form.classList.add('mb-3');
            edit_form.setAttribute('id', 'edit-form');


            card_header.innerHTML = `<a href="profile/${post.user_post}">${post.user_post}</a><br>${post.time}`;
            card_body.innerHTML = `<h5 class='card-title'>${post.post}</h5>`;
            card_body.innerHTML += `<button id='like' class='btn btn-primary' data-post=${post.id}>Like: 0</button> <button class='btn btn-primary'>Comment</button> <button class='btn btn-secondary' id='edit'>Edit</button>`;
            edit_form.innerHTML = `<textarea class="form-control" id="edit-text" rows="3"></textarea> <button class="btn btn-primary" id="edit-submit" data-post="${post.id}" type="submit">Save</button>`;
            
            edit_form.style.display = "none";
            new_post.append(card_header);
            card_body.append(edit_form);
            new_post.append(card_body);

            

            document.querySelector('#all-posts').prepend(new_post);

            document.querySelectorAll('#like').forEach(el => {
                el.addEventListener('click', liked_post);
            });
            document.querySelectorAll('#edit').forEach(el => {
                el.addEventListener('click', edit_post);
            });
        });

        //Clear out the post-text field
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
            fetch('/edit', {
                method: 'PUT',
                body: JSON.stringify({
                    post: event.target.dataset.post,
                    text: form.querySelector('#edit-text').value
                }),
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

    function comment(event){
        event.preventDefault();
        event.target.style.display = 'none';

        const new_comment_form = event.target.parentNode.querySelector('#comment-form');
        const comment_text = new_comment_form.querySelector('#comment-text');
        comment_text.value = '';

        const comment_div = event.target.parentNode.parentNode.querySelector('#comments');

        new_comment_form.style.display = 'block';
        new_comment_form.querySelector('#comment-submit').addEventListener('click', (event) => {
            event.preventDefault();
            fetch('/comment', {
                method: 'POST',
                body: JSON.stringify({
                    post: event.target.dataset.post,
                    comment: comment_text.value
                }),
            })
            .then(response => response.json())
            .then(result => {
                if (result['success'] == 'commented'){
                    comment_div.innerHTML += `
                    <div class="card">
                        <div class="card-body">
                            <blockquote class="blockquote mb-0">
                                <p>${result['comment']}</p>
                                <footer class="blockquote-footer">${result['user_comment']}</footer>
                            </blockquote>
                        </div>
                   </div>`;
                }
            });
        });



    }


    function show_comments(event){
        event.preventDefault();

        //Gives us the card fot the whole post
        const post = event.target.parentNode.parentNode;
        

        const comments = post.querySelector('#comments');

        comments.style.display = 'block';

        const new_comment_div = post.querySelector('#new-comment');

        new_comment_div.style.display = 'block';

        new_comment_div.querySelector('#add-comment').addEventListener('click', comment);

    }