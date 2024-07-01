// scripts/utils.js

// Formatieren des Datums
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

// Durchschnittliche Bewertung berechnen
function calculateAverageRating(reviews) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
}

// Exportieren der Funktionen
export { formatDate, calculateAverageRating };
