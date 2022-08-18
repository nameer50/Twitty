
document.addEventListener('DOMContentLoaded', function() {
  
  document.querySelector('#follow').addEventListener('click', follow);
});

function follow(event){
  event.preventDefault();
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  fetch('/follow', {
    method: "POST",
    body: JSON.stringify({
      user_toggled_on: event.target.dataset.user,
      type: event.target.dataset.type
    }),
    headers: {'X-CSRFToken': csrftoken}
  })

  .then(response => response.json())
  .then(result => {

    if (result['success'] == 'followed'){
      event.target.innerText = 'Unfollow';
      event.target.dataset.type = 'unfollow';
      const new_li = document.createElement('li');
      const new_follow = document.createElement('a');
      new_follow.innerHTML = `${result['user']}`;
      new_follow.setAttribute('id', `${result['user']}`);
      new_follow.setAttribute('href', `${result['user']}`)
      new_follow.classList.add('dropdown-item');
      new_li.append(new_follow);
      document.querySelector('#followers-dropdown').prepend(new_li);
      document.querySelector('#follow-toggle').innerHTML = `Followers: ${result['updated_count']}`;
    }
    else if (result['success'] == 'unfollowed'){
      event.target.innerText = 'Follow';
      event.target.dataset.type = 'follow';
      const followers = document.querySelector('#followers-dropdown')
      const user = followers.querySelector(`#${result['user']}`);
      user.parentElement.removeChild(user);
      document.querySelector('#follow-toggle').innerHTML = `Followers: ${result['updated_count']}`;
      
    }
    else if (result['error'] == 'must be logged in'){
      window.location.href = '/login';
    }
  });
}