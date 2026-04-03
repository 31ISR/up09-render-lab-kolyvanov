const API_URL = 'https://kitek.ktkv.dev/marketplace/api/items';

async function fetchData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
}

function formatPrice(price) {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function renderItems(items) {
    const container = document.querySelector('.items-grid');
    
    const html = items.map(item => `
        <div class="item-card">
            <img
                src="${item.imageUrl || ''}"
                alt="${item.title || 'Товар'}"
                class="item-image" />
            <div class="item-content">
                <span class="status-badge status-active">${item.status === 'active' ? 'Активно' : 'Завершено'}</span>
                <h3 class="item-title">${item.title || 'Без названия'}</h3>
                <p class="item-description">${item.description || 'Описание отсутствует'}</p>
                <div class="item-footer">
                    <div>
                        <div class="item-price">${formatPrice(item.price)} ₽</div>
                        ${item.highestBid ? `
                        <div class="bid-info">
                            Текущая ставка: ${formatPrice(item.highestBid)} ₽
                            <span class="bid-count">${item.bidCount || 0}</span>
                        </div>
                        ` : ''}
                    </div>
                    <div class="item-meta">
                        <span class="item-seller">
                            Продавец: ${item.username || 'Неизвестен'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function updateStats(items) {
    const totalItems = items.length;
    const totalBids = items.reduce((sum, item) => sum + (item.bidCount || 0), 0);
    const activeItems = items.filter(item => item.status === 'active').length;
    const validPrices = items.filter(item => item.price && item.price > 0);
    const avgPrice = validPrices.length > 0 
        ? Math.round(validPrices.reduce((sum, item) => sum + item.price, 0) / validPrices.length) 
        : 0;
    
    const statValues = document.querySelectorAll('.stat-value');
    statValues[0].textContent = totalItems;
    statValues[1].textContent = totalBids;
    statValues[2].textContent = activeItems;
    statValues[3].textContent = formatPrice(avgPrice) + ' ₽';
}

async function init() {
    const items = await fetchData();
    renderItems(items);
    updateStats(items);
}

init();