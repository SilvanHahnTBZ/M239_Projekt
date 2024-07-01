// scripts/main.js

// Hilfsfunktionen (ehemals utils.js)
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

function calculateAverageRating(reviews) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
}

// API-Funktionen (ehemals api.js)
const API_URL = 'http://localhost:3000';

async function getFilms() {
    const response = await fetch(`${API_URL}/films`);
    return response.json();
}

async function getFilmById(id) {
    const response = await fetch(`${API_URL}/films/${id}`);
    return response.json();
}

async function addFilm(film) {
    const response = await fetch(`${API_URL}/films`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(film)
    });
    return response.json();
}

async function updateFilm(film) {
    const response = await fetch(`${API_URL}/films/${film.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(film)
    });
    return response.json();
}

async function deleteFilm(id) {
    await fetch(`${API_URL}/films/${id}`, {
        method: 'DELETE'
    });
    loadFilms(); // Reload films after deletion
}

async function addReview(filmId, review) {
    const film = await getFilmById(filmId);
    film.reviews.push(review);
    await updateFilm(film);
}

// Hauptfunktionalität (ehemals main.js)
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('film-list.html')) {
        loadFilms();
        window.addEventListener('scroll', toggleFooterVisibility);
    } else if (path.includes('overview.html')) {
        loadOverview();
    }
});

async function loadFilms() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
    const films = await getFilms();
    displayFilmList(films);
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

function displayFilmList(films) {
    const filmsContainer = document.getElementById('filmsContainer');
    if (!filmsContainer) return;
    filmsContainer.innerHTML = '';
    films.forEach(film => {
        const filmItem = document.createElement('div');
        filmItem.className = 'filmItem';
        filmItem.innerHTML = `
            <img src="${film.poster}" alt="${film.title}">
            <div class="filmTitle">${film.title}</div>
        `;
        filmItem.onclick = () => showFilmDetail(film.id);
        filmsContainer.appendChild(filmItem);
    });
    document.getElementById('filmList').classList.remove('hidden');
    document.getElementById('filmDetail').classList.add('hidden');
}

function filterFilms() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filmsContainer = document.getElementById('filmsContainer');
    const films = Array.from(filmsContainer.getElementsByClassName('filmItem'));
    films.forEach(film => {
        const title = film.querySelector('.filmTitle').innerText.toLowerCase();
        if (title.includes(query)) {
            film.style.display = 'block';
        } else {
            film.style.display = 'none';
        }
    });
}

async function showFilmDetail(filmId) {
    document.getElementById('loading').classList.remove('hidden');
    const film = await getFilmById(filmId);
    document.getElementById('loading').classList.add('hidden');

    const filmDetail = document.getElementById('filmDetail');
    if (!filmDetail) return;
    filmDetail.innerHTML = `
        <button onclick="navigateTo('film-list.html')">Zurück zur Filmliste</button>
        <button onclick="deleteCurrentFilm(${film.id})">Film löschen</button>
        <div class="filmDetail">
            <img src="${film.poster}" alt="${film.title}">
            <h2>${film.title} (${film.year})</h2>
            <p>${film.genre}</p>
            <p>Directed by: ${film.director}</p>
            <p>${film.description}</p>
            <h3>Reviews:</h3>
            ${film.reviews.map(review => `
                <div class="review">
                    <strong>${review.username}</strong>
                    <p>Rating: ${review.rating}</p>
                    <p>${review.text}</p>
                    <p>Date: ${formatDate(review.date)}</p>
                </div>
            `).join('')}
            <form id="reviewForm" onsubmit="submitReview(event, ${film.id})">
                <h3>Add a Review:</h3>
                <input type="text" id="username" placeholder="Your name" required>
                <input type="number" id="rating" placeholder="Rating (1-5)" min="1" max="5" required>
                <textarea id="reviewText" placeholder="Your review" required></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    `;
    document.getElementById('filmList').classList.add('hidden');
    filmDetail.classList.remove('hidden');
}

async function deleteCurrentFilm(filmId) {
    await deleteFilm(filmId);
    navigateTo('film-list.html');
}

async function submitReview(event, filmId) {
    event.preventDefault();
    const newReview = {
        username: document.getElementById('username').value,
        rating: document.getElementById('rating').value,
        text: document.getElementById('reviewText').value,
        date: new Date().toISOString()
    };
    await addReview(filmId, newReview);
    showFilmDetail(filmId);
}

async function submitFilm(event) {
    event.preventDefault();
    const newFilm = {
        title: document.getElementById('filmTitle').value,
        year: document.getElementById('filmYear').value,
        genre: document.getElementById('filmGenre').value,
        director: document.getElementById('filmDirector').value,
        poster: document.getElementById('filmPoster').value,
        description: document.getElementById('filmDescription').value,
        reviews: []
    };
    await addFilm(newFilm);
    loadFilms();
}

async function loadOverview() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
    const films = await getFilms();
    displayOverview(films);
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

function displayOverview(films) {
    const overviewContainer = document.getElementById('overviewContainer');
    if (!overviewContainer) return;
    overviewContainer.innerHTML = '';
    films.forEach(film => {
        const filmOverviewItem = document.createElement('div');
        filmOverviewItem.className = 'overviewItem';
        filmOverviewItem.innerHTML = `
            <h3>${film.title} (${film.year})</h3>
            <p>Genre: ${film.genre}</p>
            <p>Director: ${film.director}</p>
            <p>Average Rating: ${calculateAverageRating(film.reviews)} (${film.reviews.length} reviews)</p>
        `;
        overviewContainer.appendChild(filmOverviewItem);
    });
}

function toggleFooterVisibility() {
    const footer = document.querySelector('footer');
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        footer.classList.add('visible');
    } else {
        footer.classList.remove('visible');
    }
}

function navigateTo(page) {
    window.location.href = page;
}

window.showFilmDetail = showFilmDetail;
