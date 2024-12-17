window.onload = () => {
  getOriginals();
  getTrendingNow();
  getTopRated();
};

function fetchMovies(url, dom_element, path_type) {
  fetch(url)
    .then(response => response.json())
    .then(data => showMovies(data.results, dom_element, path_type));
}

function showMovies(movies, dom_element, path_type) {
  const container = document.querySelector(dom_element);
  container.innerHTML = ''; // Clear existing content

  movies.forEach(movie => {
    const imgElement = document.createElement('img');
    imgElement.classList.add('movie-poster');
    imgElement.src = `https://image.tmdb.org/t/p/w500/${movie[path_type]}`;
    imgElement.alt = movie.title || movie.name;

    imgElement.addEventListener('click', () => handleMovieSelection(movie.id));

    container.appendChild(imgElement);
  });
}

function handleMovieSelection(id) {
  getMovieTrailer(id);
}

async function getMovieTrailer(id) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`);
  const data = await response.json();
  setTrailer(data.results);
}

const setTrailer = trailers => {
  const iframe = document.querySelector('.movieTrailer');
  const movieNotFound = document.querySelector('.movieNotFound');

  if (trailers.length > 0) {
    iframe.classList.remove('d-none');
    movieNotFound.classList.add('d-none');
    iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;
  } else {
    iframe.classList.add('d-none');
    movieNotFound.classList.remove('d-none');
  }
}

function getOriginals() {
  const url = 'https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213';
  fetchMovies(url, '.original__movies', 'poster_path');
}

function getTrendingNow() {
  const url = 'https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045';
  fetchMovies(url, '#trending', 'backdrop_path');
}

function getTopRated() {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1';
  fetchMovies(url, '#top_rated', 'poster_path');
}
