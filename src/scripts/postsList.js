const { buildComment } = require('./commentSection');

// Load the list of blog posts
const postListUl = document.querySelector('.post-list');

fetch('http://localhost:3000/posts', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
.then((response) => response.json())
.then((data) => {
  // Sort all posts to show most recent on top
  const sorted = data.blogPosts.sort((a, b) => {
    return new Date(b.uploadAt).getTime() - new Date(a.uploadAt).getTime();
  });

  sorted.forEach((post) => {
    const li = document.createElement('li');
    const link = document.createElement('a');

    link.textContent = post.title;
    link.href = '/';
    li.appendChild(link);
    postListUl.appendChild(li);

    link.addEventListener('click', (e) => {
      e.preventDefault();

      localStorage.setItem('post', JSON.stringify(post));
      displayPost(post);
    });
  });

  // Load first post after loading page for the first time
  displayPost(sorted[0]);
})
.catch((err) => console.log(err));

// Display post info after clicking it's link
const postTitle = document.querySelector('.post-title');
const postAuthor = document.querySelector('.post-author');
const postContent = document.querySelector('.post-content');
const commentSection = document.querySelector('.comments');


function displayPost(post) {
  const span = document.createElement('span');
  span.classList.add('posted-at');

  postTitle.textContent = post.title;
  postAuthor.textContent = post.author.firstname + ' ' + post.author.lastname;
  
  span.textContent = new Date(post.uploadAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  postAuthor.appendChild(span);

  postContent.textContent = post.content;

  // Load all comments
  fetch(`http://localhost:3000/posts/${post.id}/comments`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then((response) => response.json())
  .then((data) => {
    commentSection.innerHTML = '';

    data.comments.forEach((comment) => {
      buildComment(comment);
    })
  })
  .catch((err) => console.log(err));
}
