document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#follow').addEventListener('click', follow);
    

  });

  function follow(event){
    event.preventDefault();
    fetch('/follow', {
      method: "POST",
      body: JSON.stringify({
        user_toggled_on: event.target.dataset.user,
        type: event.target.dataset.type
      }),
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
      // CHECK THE RESULT AND CHANGE THE BUTTON TEXT
      if (result['success'] == 'followed'){
        event.target.innerText = 'Unfollow';
        event.target.dataset.type = 'unfollow';
        const new_follow = document.createElement('a');
        new_follow.innerHTML = `${result['user']}`;
        new_follow.setAttribute('id', `${result['user']}`);
        new_follow.setAttribute('href', `${result['user']}`)
        document.querySelector('#followers').append(new_follow);
      }

      else if (result['success'] == 'unfollowed'){
        event.target.innerText = 'Follow';
        event.target.dataset.type = 'follow';
        const user = document.querySelector(`#${result['user']}`);
        user.parentElement.removeChild(user);
      }
    });
  }