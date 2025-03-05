async function loadSideBarLinks() {
  const posts = await fetchAllBlogPosts();
  createAndDisplayLinks(posts);

  // Load most recent blogPost on first page load
  displayPost(posts[0]);
}
loadSideBarLinks();

async function fetchAllBlogPosts(sortedByDate = true) {
  return fetch('http://localhost:3000/posts', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then((response) => response.json())
  .then((data) => {
    if (sortedByDate) {
      return data.blogPosts.sort((a, b) => {
        return new Date(b.uploadAt).getTime() - new Date(a.uploadAt).getTime();
      })
    }

    return posts = data.blogPosts;
  })
  .catch((err) => console.log(err));
}

function createAndDisplayLinks(allPosts) {
  const postListUl = document.querySelector('.post-list');
  postListUl.innerHTML = '';

  allPosts.forEach((post) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
  
    link.textContent = post.title;
    link.href = '/';
    li.appendChild(link);
    postListUl.appendChild(li);
  
    link.addEventListener('click', (e) => {
      e.preventDefault();
  
      displayPost(post);
    });
  })
}

// Display post info after clicking it's link
const postTitle = document.querySelector('.post-title');
const postAuthor = document.querySelector('.post-author');
const postContent = document.querySelector('.post-content');
const commentSection = document.querySelector('.comments');

async function displayPost(post) {
  localStorage.setItem('post', JSON.stringify(post));

  const span = document.createElement('span');
  span.classList.add('posted-at');

  postTitle.textContent = post.title;
  postAuthor.textContent = post.author.firstname + ' ' + post.author.lastname;
  
  span.textContent = new Date(post.uploadAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  postAuthor.appendChild(span);

  postContent.textContent = post.content;

  // Fetch and display comments from post
  displayCommentsOnPage(post.id);
}

async function displayCommentsOnPage(postId) {
  // Erase all
  commentSection.innerHTML = '';
  const comments = await fetchPostComments(postId);
  
  comments.forEach((comment) => {
    buildComment(comment);
  })
}

async function fetchPostComments(postId) {
  // Fetch all comments from postId
  return fetch(`http://localhost:3000/posts/${postId}/comments`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then((response) => response.json())
  .then((data) => {
    return data = data.comments;
  })
  .catch((err) => console.log(err));
}

// Build a comment dynamically
const { DateTime } = require('luxon');

function buildComment(comment) {
  const commentDiv = document.createElement('div');
  const authorH = document.createElement('h4');
  const postedAtSpan = document.createElement('span');
  const deleteButton = document.createElement('button');
  const contentDiv = document.createElement('div');

  commentDiv.classList.add('comment-card');
  authorH.classList.add('comment-author');
  postedAtSpan.classList.add('comment-posted-at');
  deleteButton.classList.add('comment-delete-button');
  contentDiv.classList.add('comment-content');

  authorH.innerText = `${comment.author ? comment.author.firstname : 'anonymous'}`;
  const date = new Date(comment.uploadAt);
  postedAtSpan.innerText = DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
  deleteButton.innerText = 'X';
  contentDiv.innerText = comment.content;

  deleteButton.addEventListener('click', (e) => {
    e.preventDefault();

    const response = confirm('Are you sure you want to delete this comment?');

    if (response) {
      fetch(`http://localhost:3000/posts/delete/comment/${comment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      .then((response) => response.json())
      .then((data) => {
        const postId = JSON.parse(localStorage.getItem('post')).id;
        displayCommentsOnPage(postId);
      })
      .catch((err) => console.log(err));
    }
  })

  commentDiv.appendChild(authorH);
  commentDiv.appendChild(contentDiv);
  authorH.appendChild(postedAtSpan);
  authorH.appendChild(deleteButton);

  commentSection.appendChild(commentDiv);
}

// Post a new comment
const commentForm = document.querySelector('#comment-form');

commentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const comment = document.getElementById('write-a-comment').value;
  const postId = JSON.parse(localStorage.getItem('post')).id;
  const user = JSON.parse(localStorage.getItem('user'));
  const authorId = user ? user.id : undefined;
  
  if (comment === '') return;

  fetch('http://localhost:3000/posts/create/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment, postId, authorId })
  })
  .then((response) => response.json())
  .then((data) => {
    displayCommentsOnPage(postId);
  })
  .catch((err) => console.log(err));

  commentForm.reset();
});
