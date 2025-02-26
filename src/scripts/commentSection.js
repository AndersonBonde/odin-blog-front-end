// Build a comment dynamically
const { DateTime } = require('luxon');
const commentSection = document.querySelector('.comments');

function buildComment(comment) {
  const commentDiv = document.createElement('div');
  const authorH = document.createElement('h4');
  const postedAtSpan = document.createElement('span');
  const contentDiv = document.createElement('div');

  commentDiv.classList.add('comment-card');
  authorH.classList.add('comment-author');
  postedAtSpan.classList.add('comment-posted-at');
  contentDiv.classList.add('comment-content');

  authorH.innerText = `${comment.author ? comment.author.firstname : 'anonymous'}`;
  const date = new Date(comment.uploadAt);
  postedAtSpan.innerText = DateTime.fromJSDate(date).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
  contentDiv.innerText = comment.content;

  commentDiv.appendChild(authorH);
  commentDiv.appendChild(contentDiv);
  authorH.appendChild(postedAtSpan);

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
  
  console.log('Comment: ', comment, 'postId: ', postId, 'authorId: ', authorId);
  
  fetch('http://localhost:3000/posts/create/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment, postId, authorId })
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data.message);
  })
  .catch((err) => console.log(err));

  commentForm.reset();
});

module.exports = {
  buildComment
}
