const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('resultsGrid');
const searchSection = document.getElementById('searchSection');
const detailSection = document.getElementById('detailSection');
const detailContent = document.getElementById('detailContent');
const backBtn = document.getElementById('backBtn');

searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    try {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        const data = await response.json();
        const filteredSeries = data
            .map(item => item.show)
            .filter(show => show.name.toLowerCase().includes(query));

        if (filteredSeries.length > 0) {
            renderCards(filteredSeries);
        } else {
            resultsGrid.innerHTML = '<p>No se encontraron coincidencias exactas.</p>';
        }
        
    } catch (error) {
        console.error("Error cargando series:", error);
    }
});

function renderCards(series) {
    resultsGrid.innerHTML = '';
    
    series.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        const imgUrl = item.image ? item.image.medium : 'https://via.placeholder.com/210x295?text=Sin+Imagen';
        
        card.innerHTML = `
            <img src="${imgUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
        `;
        
        card.onclick = () => showDetail(item.id);
        resultsGrid.appendChild(card);
    });
}

async function showDetail(id) {
    try {
        const response = await fetch(`https://api.tvmaze.com/shows/${id}`);
        const show = await response.json();

        searchSection.classList.add('hidden');
        detailSection.classList.remove('hidden');

        detailContent.innerHTML = `
            <h1>${show.name}</h1>
            <img src="${show.image ? show.image.original : 'https://via.placeholder.com/300'}" alt="${show.name}">
            <div class="info">
                <p><strong>Género:</strong> ${show.genres.join(', ') || 'N/A'}</p>
                <p><strong>Idioma:</strong> ${show.language}</p>
                <div>${show.summary || 'Sin descripción disponible.'}</div>
            </div>
        `;
    } catch (error) {
        console.error("Error al obtener detalle:", error);
    }
}

backBtn.onclick = () => {
    detailSection.classList.add('hidden');
    searchSection.classList.remove('hidden');
};