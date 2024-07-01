// scripts/api.js

const API_URL = 'http://localhost:3000';

// Alle Filme abrufen
async function getFilms() {
    const response = await fetch(`${API_URL}/films`);
    return response.json();
}

// Film nach ID abrufen
async function getFilmById(id) {
    const response = await fetch(`${API_URL}/films/${id}`);
    return response.json();
}

// Film hinzufügen
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

// Film aktualisieren
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

// Film löschen
async function deleteFilm(id) {
    await fetch(`${API_URL}/films/${id}`, {
        method: 'DELETE'
    });
}

// Rezension hinzufügen
async function addReview(filmId, review) {
    const film = await getFilmById(filmId);
    film.reviews.push(review);
    await updateFilm(film);
}

// Exportieren der Funktionen
export { getFilms, getFilmById, addFilm, updateFilm, deleteFilm, addReview };
