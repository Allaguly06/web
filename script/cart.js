// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========

/**
 * Массив выбранных курсов
 * @type {Array<{name: string, description: string, price: number}>}
 */
let selectedCourses = [];

/**
 * Текущие активные фильтры
 * @type {Object}
 */
let currentFilters = {
    category: 'all',
    difficulty: 'all',
    price: 'all',
    duration: 'all',
    sort: 'default',
    search: ''
};

/**
 * Комбо-наборы курсов для разных профессий
 * @type {Object}
 */
const courseCombos = {
    "beginner": {
        name: "Начинающий пентестер",
        description: "Идеальный старт в информационной безопасности",
        courses: [
            "Введение в CTF",
            "Основы Linux для пентестеров",
            "Криптография для начинающих"
        ]
    },
    "web": {
        name: "Веб-пентестер",
        description: "Специалист по безопасности веб-приложений",
        courses: [
            "Веб-уязвимости и пентестинг",
            "Продвинутые веб-эксплойты",
            "Основы Linux для пентестеров"
        ]
    },
    "reverse": {
        name: "Реверс-инженер",
        description: "Специалист по анализу программного обеспечения",
        courses: [
            "Обратная инженерия",
            "Анализ вредоносного ПО",
            "Памятьная форензика"
        ]
    },
    "network": {
        name: "Сетевой специалист",
        description: "Эксперт по сетевой безопасности",
        courses: [
            "Сетевой пентестинг и анализ трафика",
            "Безопасность беспроводных сетей",
            "Форензика и анализ цифровых следов"
        ]
    },
    "crypto": {
        name: "Криптограф",
        description: "Специалист по криптографии и защите данных",
        courses: [
            "Криптография для начинающих",
            "Продвинутая криптография",
            "Введение в CTF"
        ]
    },
    "forensics": {
        name: "Киберфорензик",
        description: "Специалист по расследованию киберинцидентов",
        courses: [
            "Форензика и анализ цифровых следов",
            "Памятьная форензика",
            "Основы Linux для пентестеров"
        ]
    }
};

/**
 * База данных всех курсов с полной информацией
 * @type {Object}
 */
const coursesDatabase = {
    "Введение в CTF": {
        description: "Базовый курс по Capture The Flag соревнованиям. Изучите основы криптографии, стеганографии и анализа сетевого трафика.",
        price: 2990,
        image: "../src/CTF-Blog.jpg",
        duration: 25,
        difficulty: "beginner",
        rating: 4.8,
        category: "beginner"
    },
    "Веб-уязвимости и пентестинг": {
        description: "Изучите распространенные уязвимости веб-приложений, такие как SQL-инъекции, XSS, CSRF и методы их эксплуатации.",
        price: 4990,
        image: "../src/web-pentest.jpeg",
        duration: 35,
        difficulty: "intermediate",
        rating: 4.6,
        category: "web"
    },
    "Обратная инженерия": {
        description: "Курс по анализу и взлому программного обеспечения. Изучите ассемблер, дизассемблеры и отладчики.",
        price: 5990,
        image: "../src/Reverse-engineering.jpeg",
        duration: 45,
        difficulty: "advanced",
        rating: 4.9,
        category: "reverse"
    },
    "Криптография для начинающих": {
        description: "Основы шифрования, хэширования и криптоанализа. Практические задания по взлому шифров.",
        price: 3990,
        image: "../src/Криптография.png",
        duration: 30,
        difficulty: "beginner",
        rating: 4.7,
        category: "crypto"
    },
    "Форензика и анализ цифровых следов": {
        description: "Методы исследования цифровых доказательств, анализ файловых систем и восстановление данных.",
        price: 5490,
        image: "../src/Forenzika.png",
        duration: 40,
        difficulty: "intermediate",
        rating: 4.8,
        category: "forensics"
    },
    "Сетевой пентестинг и анализ трафика": {
        description: "Изучите методы сканирования сетей, анализа пакетов и выявления уязвимостей в сетевой инфраструктуре.",
        price: 5290,
        image: "../src/web-analiz-pen.png",
        duration: 38,
        difficulty: "intermediate",
        rating: 4.5,
        category: "network"
    },
    "Продвинутые веб-эксплойты": {
        description: "Углубленное изучение эксплуатации веб-уязвимостей, включая десериализацию, прототипное загрязнение и SSRF.",
        price: 6490,
        image: "../src/Exploits.jpg",
        duration: 50,
        difficulty: "advanced",
        rating: 4.9,
        category: "web"
    },
    "Анализ вредоносного ПО": {
        description: "Техники анализа малвари, обфускации кода и противодействия анти-отладке.",
        price: 6990,
        image: "../src/analiz-po.jpg",
        duration: 55,
        difficulty: "advanced",
        rating: 4.9,
        category: "reverse"
    },
    "Продвинутая криптография": {
        description: "Изучение современных криптографических протоколов, атак на реализации и side-channel атак.",
        price: 5990,
        image: "../src/kripto.jpg",
        duration: 42,
        difficulty: "advanced",
        rating: 4.8,
        category: "crypto"
    },
    "Памятьная форензика": {
        description: "Анализ дампов оперативной памяти для обнаружения следов взлома и вредоносной активности.",
        price: 5790,
        image: "../src/Форензика.jpg",
        duration: 36,
        difficulty: "intermediate",
        rating: 4.7,
        category: "forensics"
    },
    "Основы Linux для пентестеров": {
        description: "Необходимые навыки работы с Linux, Bash-скрипты и инструменты для тестирования на проникновение.",
        price: 3490,
        image: "../src/linux.jpeg",
        duration: 28,
        difficulty: "beginner",
        rating: 4.6,
        category: "beginner"
    },
    "Безопасность беспроводных сетей": {
        description: "Методы взлома и защиты Wi-Fi сетей, анализ трафика и атаки на беспроводные протоколы.",
        price: 4990,
        image: "../src/wep_wpa_wpa2_wpa3.jpg",
        duration: 32,
        difficulty: "intermediate",
        rating: 4.5,
        category: "network"
    }
};

// ========== ФУНКЦИИ ФИЛЬТРАЦИИ И ПОИСКА ==========

/**
 * Применяет все активные фильтры к курсам
 * @returns {void}
 */
function applyFilters() {
    console.log('Applying filters:', currentFilters);
    
    // Обновляем текущие фильтры из UI
    updateCurrentFilters();
    
    const courses = document.querySelectorAll('.course-item');
    let visibleCount = 0;

    courses.forEach(course => {
        const shouldShow = shouldCourseBeVisible(course);
        
        if (shouldShow) {
            course.style.display = 'flex';
            visibleCount++;
        } else {
            course.style.display = 'none';
        }
    });

    // Сортируем видимые курсы
    sortCourses();
    
    // Обновляем счетчик и сообщения
    updateCoursesCounter(visibleCount);
    toggleNoCoursesMessage(visibleCount === 0);
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
}

/**
 * Проверяет, должен ли курс быть видимым при текущих фильтрах
 * @param {HTMLElement} course - Элемент курса
 * @returns {boolean} - Должен ли курс быть видимым
 */
function shouldCourseBeVisible(course) {
    const courseData = {
        categories: course.dataset.categories,
        difficulty: course.dataset.difficulty,
        price: parseInt(course.dataset.price),
        duration: parseInt(course.dataset.duration),
        title: course.querySelector('.course-title').textContent.toLowerCase(),
        description: course.querySelector('.course-description').textContent.toLowerCase()
    };

    // Проверка категории
    if (currentFilters.category !== 'all' && !courseData.categories.includes(currentFilters.category)) {
        return false;
    }

    // Проверка сложности
    if (currentFilters.difficulty !== 'all' && courseData.difficulty !== currentFilters.difficulty) {
        return false;
    }

    // Проверка цены
    if (!passesPriceFilter(courseData.price)) {
        return false;
    }

    // Проверка продолжительности
    if (!passesDurationFilter(courseData.duration)) {
        return false;
    }

    // Проверка поискового запроса
    if (!passesSearchFilter(courseData.title, courseData.description)) {
        return false;
    }

    return true;
}

/**
 * Проверяет соответствие курса фильтру цены
 * @param {number} price - Цена курса
 * @returns {boolean} - Соответствует ли фильтру
 */
function passesPriceFilter(price) {
    switch (currentFilters.price) {
        case 'budget':
            return price <= 4000;
        case 'medium':
            return price > 4000 && price <= 6000;
        case 'premium':
            return price > 6000;
        default:
            return true;
    }
}

/**
 * Проверяет соответствие курса фильтру продолжительности
 * @param {number} duration - Продолжительность курса
 * @returns {boolean} - Соответствует ли фильтру
 */
function passesDurationFilter(duration) {
    switch (currentFilters.duration) {
        case 'short':
            return duration <= 20;
        case 'medium':
            return duration > 20 && duration <= 40;
        case 'long':
            return duration > 40;
        default:
            return true;
    }
}

/**
 * Проверяет соответствие курса поисковому запросу
 * @param {string} title - Название курса
 * @param {string} description - Описание курса
 * @returns {boolean} - Соответствует ли поиску
 */
function passesSearchFilter(title, description) {
    if (!currentFilters.search) return true;
    
    const searchTerms = currentFilters.search.split(' ').filter(term => term.length > 0);
    
    return searchTerms.some(term => 
        title.includes(term) || description.includes(term)
    );
}

/**
 * Сортирует видимые курсы согласно выбранной сортировке
 * @returns {void}
 */
function sortCourses() {
    const container = document.getElementById('coursesContainer');
    const visibleCourses = Array.from(container.querySelectorAll('.course-item[style*="display: flex"]'));

    if (visibleCourses.length === 0) return;

    visibleCourses.sort((courseA, courseB) => {
        switch (currentFilters.sort) {
            case 'price-asc':
                return parseInt(courseA.dataset.price) - parseInt(courseB.dataset.price);
                
            case 'price-desc':
                return parseInt(courseB.dataset.price) - parseInt(courseA.dataset.price);
                
            case 'name-asc':
                return courseA.querySelector('.course-title').textContent
                    .localeCompare(courseB.querySelector('.course-title').textContent);
                
            case 'name-desc':
                return courseB.querySelector('.course-title').textContent
                    .localeCompare(courseA.querySelector('.course-title').textContent);
                
            case 'duration-asc':
                return parseInt(courseA.dataset.duration) - parseInt(courseB.dataset.duration);
                
            default:
                return 0; // По умолчанию - порядок в DOM
        }
    });

    // Перемещаем отсортированные курсы в DOM
    visibleCourses.forEach(course => container.appendChild(course));
}

/**
 * Обновляет счетчик найденных курсов
 * @param {number} count - Количество видимых курсов
 * @returns {void}
 */
function updateCoursesCounter(count) {
    const counterElement = document.getElementById('coursesCount');
    if (counterElement) {
        counterElement.textContent = count;
        counterElement.style.color = count === 0 ? '#dc3545' : '#28a745';
    }
}

/**
 * Показывает или скрывает сообщение об отсутствии курсов
 * @param {boolean} show - Показывать ли сообщение
 * @returns {void}
 */
function toggleNoCoursesMessage(show) {
    const existingMessage = document.getElementById('noCoursesMessage');
    
    if (show && !existingMessage) {
        showNoCoursesMessage();
    } else if (!show && existingMessage) {
        removeNoCoursesMessage();
    }
}

/**
 * Показывает сообщение об отсутствии курсов
 * @returns {void}
 */
function showNoCoursesMessage() {
    const message = document.createElement('div');
    message.id = 'noCoursesMessage';
    message.className = 'no-courses-message';
    message.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3 style="margin-bottom: 10px;">😔 Курсы не найдены</h3>
            <p style="margin-bottom: 20px;">Попробуйте изменить параметры фильтрации или поисковый запрос</p>
            <button class="clear-filters" onclick="clearAllFilters()" 
                    style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                Сбросить все фильтры
            </button>
        </div>
    `;
    document.getElementById('coursesContainer').appendChild(message);
}

/**
 * Удаляет сообщение об отсутствии курсов
 * @returns {void}
 */
function removeNoCoursesMessage() {
    const message = document.getElementById('noCoursesMessage');
    if (message) {
        message.remove();
    }
}

/**
 * Сбрасывает все фильтры к значениям по умолчанию
 * @returns {void}
 */
function clearAllFilters() {
    console.log('Clearing all filters');
    
    // Сбрасываем кнопки категорий
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-button[data-category="all"]').classList.add('active');

    // Сбрасываем выпадающие списки
    document.getElementById('difficultyFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('durationFilter').value = 'all';
    document.getElementById('sortFilter').value = 'default';
    document.getElementById('searchInput').value = '';

    // Сбрасываем объект фильтров
    currentFilters = {
        category: 'all',
        difficulty: 'all',
        price: 'all',
        duration: 'all',
        sort: 'default',
        search: ''
    };

    // Применяем сброс
    applyFilters();
    showNotification('Все фильтры сброшены', 'info');
}

/**
 * Фильтрация курсов по категориям (обработчик клика по кнопкам)
 * @param {string} category - Категория для фильтрации
 * @returns {void}
 */
function filterCourses(category) {
    console.log('Filtering by category:', category);
    
    // Обновляем активную кнопку
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');

    // Применяем фильтры
    applyFilters();
}

// ========== ФУНКЦИИ РЕКОМЕНДАЦИЙ ==========

/**
 * Показывает рекомендации курсов для выбранной профессии
 * @param {string} category - Категория профессии
 * @returns {void}
 */
function showRecommendations(category) {
    console.log('Showing recommendations for:', category);
    
    const combo = courseCombos[category];
    if (!combo) {
        showNotification('Профессия не найдена', 'error');
        return;
    }

    const recommendationsContainer = document.getElementById('recommendations');
    const recommendedCoursesContainer = document.getElementById('recommendedCourses');
    
    // Очищаем контейнер
    recommendedCoursesContainer.innerHTML = '';
    
    // Добавляем рекомендованные курсы
    let addedCourses = 0;
    combo.courses.forEach(courseName => {
        const courseInfo = getCourseInfo(courseName);
        if (courseInfo) {
            const courseElement = createRecommendedCourseElement(courseName, courseInfo);
            recommendedCoursesContainer.appendChild(courseElement);
            addedCourses++;
        }
    });
    
    if (addedCourses === 0) {
        showNotification('Нет доступных курсов для этой профессии', 'warning');
        return;
    }
    
    // Обновляем заголовок
    recommendationsContainer.querySelector('h3').textContent = 
        `🎯 Рекомендуемые курсы для профессии: ${combo.name}`;
    
    // Показываем блок рекомендаций
    recommendationsContainer.style.display = 'block';
    
    // Прокручиваем к рекомендациям
    recommendationsContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    showNotification(`Показаны рекомендации для: ${combo.name}`, 'info');
}

/**
 * Создает HTML-элемент для рекомендованного курса
 * @param {string} courseName - Название курса
 * @param {Object} courseInfo - Информация о курсе
 * @returns {HTMLElement} - Элемент курса
 */
function createRecommendedCourseElement(courseName, courseInfo) {
    const courseElement = document.createElement('div');
    courseElement.className = 'course-item';
    courseElement.innerHTML = `
        <div class="course-image">
            <img src="${courseInfo.image}" alt="${courseName}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+0JLQstC10LTQuNGC0Ysg0LIgQ1RGPC90ZXh0Pjwvc3ZnPg=='">
        </div>
        <div class="course-badge ${courseInfo.difficulty}">
            ${getDifficultyText(courseInfo.difficulty)}
        </div>
        <div class="course-title">${courseName}</div>
        <div class="course-meta">
            <span class="course-price">${courseInfo.price.toLocaleString()} ₽</span>
            <span class="course-duration">${courseInfo.duration} часов</span>
            <span class="course-rating">⭐ ${courseInfo.rating}</span>
        </div>
        <div class="course-description">${courseInfo.description}</div>
        <div class="course-actions">
            <button class="add-button" onclick="addToCourse('${courseName}', '${courseInfo.description}')">
                Добавить в корзину
            </button>
        </div>
    `;
    return courseElement;
}

/**
 * Возвращает текстовое представление уровня сложности
 * @param {string} difficulty - Уровень сложности
 * @returns {string} - Текст для отображения
 */
function getDifficultyText(difficulty) {
    const difficultyMap = {
        'beginner': 'Для начинающих',
        'intermediate': 'Средний уровень',
        'advanced': 'Продвинутый'
    };
    return difficultyMap[difficulty] || 'Неизвестно';
}

/**
 * Закрывает блок рекомендаций
 * @returns {void}
 */
function closeRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.style.display = 'none';
    showNotification('Рекомендации закрыты', 'info');
}

/**
 * Добавляет все рекомендованные курсы в корзину
 * @returns {void}
 */
function addAllRecommendedCourses() {
    const recommendationsContainer = document.getElementById('recommendations');
    const title = recommendationsContainer.querySelector('h3').textContent;
    
    // Извлекаем название профессии из заголовка
    const professionName = title.replace('🎯 Рекомендуемые курсы для профессии: ', '');
    const targetCombo = findComboByName(professionName);
    
    if (!targetCombo) {
        showNotification('Не удалось найти профессию', 'error');
        return;
    }
    
    let addedCount = 0;
    let alreadyAdded = 0;
    
    targetCombo.courses.forEach(courseName => {
        const courseInfo = getCourseInfo(courseName);
        if (courseInfo) {
            const isAlreadyInCart = selectedCourses.some(course => course.name === courseName);
            
            if (!isAlreadyInCart) {
                selectedCourses.push({
                    name: courseName,
                    description: courseInfo.description,
                    price: courseInfo.price
                });
                addedCount++;
            } else {
                alreadyAdded++;
            }
        }
    });
    
    // Сохраняем в localStorage и обновляем UI
    if (addedCount > 0) {
        localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
        updateCartUI();
    }
    
    // Показываем уведомление с результатами
    if (addedCount > 0 && alreadyAdded > 0) {
        showNotification(
            `Добавлено ${addedCount} новых курсов. ${alreadyAdded} уже были в корзине.`, 
            'success'
        );
    } else if (addedCount > 0) {
        showNotification(`Все ${addedCount} курсов добавлены в корзину!`, 'success');
    } else if (alreadyAdded > 0) {
        showNotification('Все курсы для этой профессии уже в корзине!', 'warning');
    } else {
        showNotification('Не удалось добавить курсы', 'error');
    }
}

/**
 * Находит комбо по названию профессии
 * @param {string} professionName - Название профессии
 * @returns {Object|null} - Объект комбо или null
 */
function findComboByName(professionName) {
    for (const [key, combo] of Object.entries(courseCombos)) {
        if (combo.name === professionName) {
            return combo;
        }
    }
    return null;
}

/**
 * Получает полную информацию о курсе по названию
 * @param {string} courseName - Название курса
 * @returns {Object|null} - Информация о курсе или null
 */
function getCourseInfo(courseName) {
    return coursesDatabase[courseName] || null;
}

// ========== ФУНКЦИИ КОРЗИНЫ ==========

/**
 * Инициализирует корзину при загрузке страницы
 * @returns {void}
 */
function initCart() {
    console.log('Initializing cart...');
    
    // Восстанавливаем корзину из localStorage
    const savedCart = localStorage.getItem('selectedCourses');
    if (savedCart) {
        try {
            selectedCourses = JSON.parse(savedCart);
            console.log('Restored cart from localStorage:', selectedCourses);
        } catch (e) {
            console.error('Error parsing cart data from localStorage:', e);
            selectedCourses = [];
            localStorage.removeItem('selectedCourses');
        }
    }
    
    updateCartUI();
    setupCartCounter();
}

/**
 * Добавляет курс в корзину
 * @param {string} courseName - Название курса
 * @param {string} courseDescription - Описание курса
 * @returns {void}
 */
function addToCourse(courseName, courseDescription) {
    console.log('Adding course to cart:', courseName);
    
    // Проверяем, не добавлен ли уже курс
    const isAlreadyAdded = selectedCourses.some(course => course.name === courseName);
    
    if (isAlreadyAdded) {
        showNotification(`Курс "${courseName}" уже в корзине!`, 'warning');
        return;
    }
    
    // Получаем информацию о курсе
    const courseInfo = getCourseInfo(courseName);
    if (!courseInfo) {
        showNotification(`Ошибка: информация о курсе "${courseName}" не найдена`, 'error');
        return;
    }
    
    // Добавляем курс в корзину
    selectedCourses.push({
        name: courseName,
        description: courseDescription,
        price: courseInfo.price
    });
    
    // Сохраняем в localStorage
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    
    // Обновляем UI
    updateCartUI();
    showNotification(`Курс "${courseName}" добавлен в корзину! 🎉`, 'success');
}

/**
 * Настраивает счетчик корзины в навигации
 * @returns {void}
 */
function setupCartCounter() {
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    
    // Проверяем, не добавлен ли уже счетчик
    if (document.getElementById('cartCounter')) return;
    
    const cartItem = document.createElement('li');
    cartItem.innerHTML = `
        <a href="#" onclick="viewCart(); return false;" style="position: relative; display: flex; align-items: center;">
            🛒 Корзина
            <span id="cartCounter" style="display: none; position: absolute; top: -8px; right: -8px; background: #dc3545; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 12px; text-align: center; line-height: 18px; font-weight: bold;">0</span>
        </a>
    `;
    nav.appendChild(cartItem);
    
    updateCartCounter();
}

/**
 * Обновляет счетчик корзины
 * @returns {void}
 */
function updateCartCounter() {
    const cartCounter = document.getElementById('cartCounter');
    if (!cartCounter) return;
    
    if (selectedCourses.length > 0) {
        cartCounter.textContent = selectedCourses.length;
        cartCounter.style.display = 'inline-block';
    } else {
        cartCounter.style.display = 'none';
    }
}

/**
 * Обновляет интерфейс корзины (кнопка оплаты и счетчик)
 * @returns {void}
 */
function updateCartUI() {
    console.log('Updating cart UI, courses count:', selectedCourses.length);
    
    const payButton = document.getElementById('payButton');
    if (payButton) {
        if (selectedCourses.length > 0) {
            payButton.style.display = 'inline-block';
            payButton.textContent = `Перейти к оплате (${selectedCourses.length})`;
        } else {
            payButton.style.display = 'none';
        }
    }
    
    updateCartCounter();
}

/**
 * Переходит к оплате выбранных курсов
 * @returns {boolean} - Успешность операции
 */
function proceedToPayment() {
    console.log('Proceeding to payment...');
    
    if (selectedCourses.length === 0) {
        showNotification('Корзина пуста! Выберите хотя бы один курс.', 'error');
        return false;
    }
    
    // Проверяем, соответствует ли заказ какому-либо комбо
    const validationResult = validateOrderCombo();
    if (!validationResult.isValid) {
        showNotification(
            `Рекомендуем добавить: ${validationResult.missingCourses.join(', ')} для полного набора навыков`, 
            'warning'
        );
    }
    
    // Сохраняем данные в localStorage
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    
    // Здесь можно добавить логику перенаправления на страницу оплаты
    showNotification('Переход к оплате...', 'info');
    
    // Имитация перехода к оплате
    setTimeout(() => {
        // window.location.href = 'payment.html';
        console.log('Redirecting to payment page...');
    }, 1000);
    
    return true;
}

/**
 * Проверяет, соответствует ли заказ какому-либо комбо-набору
 * @returns {Object} - Результат проверки
 */
function validateOrderCombo() {
    const selectedCourseNames = selectedCourses.map(course => course.name);
    let bestMatch = null;
    let minMissing = Infinity;
    
    for (const [comboKey, combo] of Object.entries(courseCombos)) {
        const missingCourses = combo.courses.filter(course => !selectedCourseNames.includes(course));
        
        if (missingCourses.length === 0) {
            return {
                isValid: true,
                comboName: combo.name,
                missingCourses: []
            };
        }
        
        if (missingCourses.length < minMissing) {
            minMissing = missingCourses.length;
            bestMatch = {
                comboName: combo.name,
                missingCourses: missingCourses
            };
        }
    }
    
    return {
        isValid: false,
        comboName: bestMatch?.comboName || 'Неизвестно',
        missingCourses: bestMatch?.missingCourses || []
    };
}

/**
 * Показывает содержимое корзины в модальном окне
 * @returns {void}
 */
function viewCart() {
    console.log('Opening cart modal');
    
    if (selectedCourses.length === 0) {
        showNotification('Корзина пуста!', 'info');
        return;
    }
    
    const modal = createCartModal();
    document.body.appendChild(modal);
    
    // Блокируем прокрутку фонового контента
    document.body.style.overflow = 'hidden';
}

/**
 * Создает модальное окно корзины
 * @returns {HTMLElement} - Элемент модального окна
 */
function createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'cartModal';
    
    const total = selectedCourses.reduce((sum, course) => sum + course.price, 0);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 style="margin: 0;">🛒 Ваша корзина</h2>
                <button class="close-button" onclick="closeCartModal()">×</button>
            </div>
            <div class="cart-items-container">
                ${selectedCourses.map((course, index) => `
                    <div class="cart-item" id="cart-item-${index}">
                        <div class="cart-item-info">
                            <strong>${course.name}</strong>
                            <br>
                            <small style="color: #666;">${course.description.substring(0, 60)}...</small>
                        </div>
                        <div class="cart-item-actions">
                            <div style="font-weight: bold; color: darkblue;">${course.price.toLocaleString()} руб.</div>
                            <button onclick="removeFromCart(${index})" 
                                    style="color: #dc3545; border: none; background: none; cursor: pointer; font-size: 12px; margin-top: 5px; text-decoration: underline;">
                                Удалить
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                <strong>Итого: ${total.toLocaleString()} руб.</strong>
            </div>
            <div class="cart-buttons">
                <button class="cart-button cart-button-secondary" onclick="closeCartModal()">
                    Продолжить покупки
                </button>
                <button class="cart-button cart-button-primary" onclick="proceedToPayment()">
                    💳 Перейти к оплате
                </button>
            </div>
        </div>
    `;
    
    return modal;
}

/**
 * Закрывает модальное окно корзины
 * @returns {void}
 */
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.remove();
        // Восстанавливаем прокрутку
        document.body.style.overflow = '';
    }
}

/**
 * Удаляет курс из корзины
 * @param {number} index - Индекс курса в массиве selectedCourses
 * @returns {void}
 */
function removeFromCart(index) {
    if (index < 0 || index >= selectedCourses.length) {
        showNotification('Ошибка: курс не найден в корзине', 'error');
        return;
    }
    
    const removedCourse = selectedCourses[index];
    selectedCourses.splice(index, 1);
    
    // Обновляем localStorage
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    
    // Обновляем UI
    updateCartUI();
    
    // Обновляем или закрываем модальное окно корзины
    const modal = document.getElementById('cartModal');
    if (modal) {
        if (selectedCourses.length === 0) {
            closeCartModal();
            showNotification('Корзина пуста!', 'info');
        } else {
            // Пересоздаем модальное окно с обновленным списком
            closeCartModal();
            viewCart();
        }
    }
    
    showNotification(`Курс "${removedCourse.name}" удален из корзины`, 'info');
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Показывает уведомление пользователю
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип уведомления (success, error, warning, info)
 * @returns {void}
 */
function showNotification(message, type = 'info') {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">
                ×
            </button>
        </div>
    `;
    
    // Добавляем стили
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.zIndex = '1001';
    notification.style.maxWidth = '300px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.animation = 'slideIn 0.3s ease';
    
    // Цвета в зависимости от типа
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }
    }, 4000);
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

/**
 * Настраивает обработчики для кнопок фильтрации
 * @returns {void}
 */
function setupFilterHandlers() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterCourses(this.dataset.category);
        });
    });
}

/**
 * Настраивает обработчик клика вне модального окна
 * @returns {void}
 */
function setupModalCloseHandler() {
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('cartModal');
        if (modal && event.target === modal) {
            closeCartModal();
        }
    });
}

/**
 * Настраивает обработчик клавиши Escape для закрытия модальных окон
 * @returns {void}
 */
function setupEscapeHandler() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCartModal();
            closeRecommendations();
        }
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ==========

/**
 * Основная функция инициализации страницы
 * @returns {void}
 */
function initializePage() {
    console.log('Initializing CTF Courses page...');
    
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
}

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML ==========
// Делаем функции доступными глобально для вызова из HTML

window.addToCourse = addToCourse;
window.proceedToPayment = proceedToPayment;
window.viewCart = viewCart;
window.closeCartModal = closeCartModal;
window.removeFromCart = removeFromCart;
window.filterCourses = filterCourses;
window.showRecommendations = showRecommendations;
window.closeRecommendations = closeRecommendations;
window.addAllRecommendedCourses = addAllRecommendedCourses;
window.applyFilters = applyFilters;
window.clearAllFilters = clearAllFilters;

// Запуск инициализации при полной загрузке DOM
document.addEventListener('DOMContentLoaded', initializePage);

// Резервная инициализация если DOM уже загружен
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}