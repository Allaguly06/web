
/**
 * Функция для загрузки данных о курсах из нашего API
 * @returns {Promise<Array>} Промис с массивом объектов курсов
 */
function loadCoursesFromAPI() {
    const apiUrl = 'http://localhost:5000/api/courses';
    
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(courses => {
            console.log('Данные о курсах успешно загружены из API:', courses);
            // Обновляем базу данных курсами из API
            updateCoursesDatabaseFromAPI(courses);
            return courses;
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных о курсах:', error);
            // Показываем уведомление только если это не первая загрузка
            if (Object.keys(coursesDatabase).length === 0) {
                showNotification('Не удалось загрузить курсы из API. Используются локальные данные.', 'warning');
            }
            return [];
        });
}

/**
 * Обновляет базу данных курсами из API
 * @param {Array} apiCourses - Курсы из API
 */
function updateCoursesDatabaseFromAPI(apiCourses) {
    apiCourses.forEach(course => {
        // Добавляем курс в базу данных, если его там нет
        if (!coursesDatabase[course.name]) {
            coursesDatabase[course.name] = {
                description: course.description,
                price: course.price,
                image: course.image,
                duration: course.duration,
                difficulty: course.difficulty,
                rating: course.rating,
                category: course.category
            };
        }
    });
}

// ========== ОБНОВЛЯЕМ СУЩЕСТВУЮЩИЕ ФУНКЦИИ ==========

/**
 * Основная функция инициализации страницы
 * @returns {void}
 */
function initializePage() {
    console.log('Initializing CTF Courses page...');
    
    // Сначала загружаем курсы из API
    loadCoursesFromAPI().then(apiCourses => {
        console.log('API courses loaded:', apiCourses);
        
        // Инициализация фильтрации
        setupFilterHandlers();
        
        // Инициализация корзины
        initCart();
        
        // Настройка обработчиков модальных окон
        setupModalCloseHandler();
        setupEscapeHandler();
        
        // Устанавливаем фильтр "Все курсы" по умолчанию
        filterCourses('all');
        
        // Применяем фильтры для подсчета курсов
        applyFilters();
        
        console.log('Page initialized successfully!');
        showNotification('Добро пожаловать в CTF Courses! 🚀', 'info');
    }).catch(error => {
        console.error('Failed to initialize page:', error);
        // Если API не доступен, используем локальные данные
        setupFilterHandlers();
        initCart();
        setupModalCloseHandler();
        setupEscapeHandler();
        filterCourses('all');
        applyFilters();
        showNotification('Добро пожаловать в CTF Courses! (Локальный режим)', 'info');
    });
}

/**
 * Обновляет объект currentFilters из элементов UI
 * @returns {void}
 */
function updateCurrentFilters() {
    currentFilters = {
        category: document.querySelector('.filter-button.active')?.dataset.category || 'all',
        difficulty: document.getElementById('difficultyFilter').value,
        price: document.getElementById('priceFilter').value,
        duration: document.getElementById('durationFilter').value,
        sort: document.getElementById('sortFilter').value,
        search: document.getElementById('searchInput').value.toLowerCase().trim()
    };
    
    // Если есть активные фильтры, обновляем данные из API
    if (currentFilters.category !== 'all' || currentFilters.difficulty !== 'all' || 
        currentFilters.search !== '' || currentFilters.price !== 'all' || currentFilters.duration !== 'all') {
        loadFilteredCoursesFromAPI();
    }
}

/**
 * Загружает отфильтрованные курсы из API
 * @returns {void}
 */
function loadFilteredCoursesFromAPI() {
    const apiUrl = 'http://localhost:5000/api/courses';
    const params = new URLSearchParams();
    
    if (currentFilters.category !== 'all') params.append('category', currentFilters.category);
    if (currentFilters.difficulty !== 'all') params.append('difficulty', currentFilters.difficulty);
    if (currentFilters.search !== '') params.append('search', currentFilters.search);
    
    fetch(`${apiUrl}?${params}`)
        .then(response => response.json())
        .then(courses => {
            // Временно обновляем отображение курсов из API
            temporaryDisplayAPICourses(courses);
        })
        .catch(error => {
            console.error('Error loading filtered courses:', error);
        });
}

/**
 * Временно отображает курсы из API (для демонстрации)
 * @param {Array} courses - Курсы из API
 */
function temporaryDisplayAPICourses(courses) {
    console.log('Filtered API courses:', courses);
    // Здесь можно добавить логику для отображения курсов из API
    // если нужно показать разницу между локальными и API данными
}

// ========== ДЕЛАЕМ ФУНКЦИИ ГЛОБАЛЬНЫМИ ==========
window.loadCoursesFromAPI = loadCoursesFromAPI;