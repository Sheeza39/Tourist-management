// Define the base URL of your API
const baseUrl = 'http://localhost:3000';

// Fetch top-rated attractions
async function fetchTopRatedAttractions() {
    try {
        const response = await fetch(`${baseUrl}/attractions/top-rated`);
        if (!response.ok) {
            throw new Error('Failed to fetch top-rated attractions');
        }
        const attractions = await response.json();
        displayTopRatedAttractions(attractions);
    } catch (error) {
        console.error('Error fetching attractions:', error);
        showErrorMessage('Error fetching attractions. Please try again later.');
    }
}

// Display top-rated attractions
function displayTopRatedAttractions(attractions) {
    const container = document.getElementById('top-rated-attractions');
    container.innerHTML = ''; // Clear previous content

    if (attractions.length === 0) {
        container.innerHTML = '<p>No top-rated attractions found.</p>';
        return;
    }

    attractions.forEach(attraction => {
        const div = document.createElement('div');
        div.classList.add('attraction-item');
        div.innerHTML = `
            <h3>${attraction.name}</h3>
            <p><strong>Location:</strong> ${attraction.location}</p>
            <p><strong>Entry Fee:</strong> $${attraction.entryFee}</p>
            <p><strong>Rating:</strong> ${attraction.rating} / 5</p>
        `;
        container.appendChild(div);
    });
}

// Show error message on the page
function showErrorMessage(message) {
    const container = document.getElementById('top-rated-attractions');
    container.innerHTML = `<p class="error">${message}</p>`;
}

// Wait for DOM content to load before making the request
document.addEventListener('DOMContentLoaded', fetchTopRatedAttractions);
