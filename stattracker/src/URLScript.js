const form = document.getElementById('player_info');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const tagline = document.getElementById('tagline').value;

  const searchParams = new URLSearchParams();
  searchParams.append('username', username);
  searchParams.append('tagline', tagline);

  baseURL = 'results.html';
  desiredURL = `${baseURL}?${searchParams.toString()}`;

  window.location.href = desiredURL;
})