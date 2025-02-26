// Display header information
const token = localStorage.getItem('token');
const loginButton = document.querySelector('.login-button');
const logoutButton = document.querySelector('.logout-button');
const userInfo = document.querySelector('.user-info');

if (token) {
  const user = JSON.parse(localStorage.getItem('user'));

  userInfo.textContent = 'User: ' + user.firstname + ' ' + user.lastname;

  loginButton.style.display = 'none';
  logoutButton.style.display = 'inline-block';
} else {
  loginButton.style.display = 'inline-block';
  logoutButton.style.display = 'none';
}

logoutButton.addEventListener('click', (e) => {
  e.preventDefault();

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  window.location.href = './index.html';
});

loginButton.addEventListener('click', (e) => {
  window.location.href = './login.html';
});
