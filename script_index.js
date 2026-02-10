document.addEventListener('DOMContentLoaded', function() {
    // Получаем все элементы городов
    const cities = document.querySelectorAll('.city');
    const cityNameElement = document.getElementById('city-name');
    const stationCountElement = document.getElementById('station-count');
    const stationsContainer = document.getElementById('stations-container');
    
    // Для каждого города добавляем обработчики событий
    cities.forEach(city => {
        // При наведении мыши
        city.addEventListener('mouseenter', function() {
            const cityName = this.getAttribute('data-city');
            const stationsData = JSON.parse(this.getAttribute('data-stations'));
            
            // Обновляем название города
            cityNameElement.textContent = cityName;
            
            // Обновляем количество станций
            stationCountElement.textContent = `${stationsData.length} популярных радиостанций`;
            
            // Очищаем контейнер
            stationsContainer.innerHTML = '';
            
            // Добавляем карточки радиостанций
            stationsData.forEach(station => {
                const stationCard = document.createElement('div');
                stationCard.className = 'station-card';
                
                stationCard.innerHTML = `
                    <div class="station-header">
                        <div class="station-name">${station.name}</div>
                        <div class="station-freq">${station.freq}</div>
                    </div>
                    <div class="station-genre">
                        <i class="fas fa-music"></i>
                        <span>${station.genre}</span>
                    </div>
                `;
                
                stationsContainer.appendChild(stationCard);
            });
            
            // Добавляем эффект "выделения" для текущего города
            this.classList.add('active');
        });
        
        // При уходе мыши
        city.addEventListener('mouseleave', function() {
            // Убираем эффект выделения
            this.classList.remove('active');
        });
        
        // Для мобильных устройств добавляем обработчик клика
        city.addEventListener('click', function() {
            // На мобильных устройствах клик работает как наведение
            if (window.innerWidth <= 768) {
                const cityName = this.getAttribute('data-city');
                const stationsData = JSON.parse(this.getAttribute('data-stations'));
                
                cityNameElement.textContent = cityName;
                stationCountElement.textContent = `${stationsData.length} популярных радиостанций`;
                stationsContainer.innerHTML = '';
                
                stationsData.forEach(station => {
                    const stationCard = document.createElement('div');
                    stationCard.className = 'station-card';
                    
                    stationCard.innerHTML = `
                        <div class="station-header">
                            <div class="station-name">${station.name}</div>
                            <div class="station-freq">${station.freq}</div>
                        </div>
                        <div class="station-genre">
                            <i class="fas fa-music"></i>
                            <span>${station.genre}</span>
                        </div>
                    `;
                    
                    stationsContainer.appendChild(stationCard);
                });
                
                // Прокручиваем к панели на мобильных устройствах
                if (window.innerWidth <= 768) {
                    document.querySelector('.radio-panel').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Инициализация при загрузке
    function initMap() {
        // Устанавливаем начальное состояние панели
        cityNameElement.textContent = "Выберите город";
        stationCountElement.textContent = "Наведите на город на карте";
        
        // Создаем начальное состояние с инструкцией
        stationsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <p>Наведите курсор на любой город на карте, чтобы увидеть популярные радиостанции</p>
                <p style="margin-top: 15px; font-size: 0.9rem; color: #aaa;">
                    <i class="fas fa-mobile-alt"></i> На мобильных устройствах нажмите на город
                </p>
            </div>
        `;
    }
    
    // Запускаем инициализацию
    initMap();
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        // Можно добавить дополнительную логику при изменении размера
    });
});