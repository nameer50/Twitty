document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll('#like').forEach(el => {
        el.addEventListener('click', liked_post);
    });

    document.querySelectorAll('#unlike').forEach(el => {
        el.addEventListener('click', liked_post);
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

function show_comments(event){
    event.preventDefault();

    //Gives us the card for the whole post
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
               comment_button.innerHTML = `Comments: ${result['comments_amount']}`;
               new_comment_form.style.display = 'none';
               add_comment_button.style.display = 'block';
            }
        });
        comment_text.value = '';
        
    });
}
