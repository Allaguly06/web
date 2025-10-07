// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let selectedCourses = [];
let coursesDatabase = {};
let currentFilters = {
    category: 'all',
    difficulty: 'all', 
    price: 'all',
    duration: 'all',
    sort: 'default',
    search: ''
};

// Комбо-наборы курсов
const courseCombos = {
    "beginner": {
        name: "Начинающий пентестер",
        description: "Идеальный старт в информационной безопасности",
        courses: ["Введение в CTF", "Основы Linux для пентестеров", "Криптография для начинающих"]
    },
    "web": {
        name: "Веб-пентестер",
        description: "Специалист по безопасности веб-приложений",
        courses: ["Веб-уязвимости и пентестинг", "Продвинутые веб-эксплойты", "Основы Linux для пентестеров"]
    },
    "reverse": {
        name: "Реверс-инженер",
        description: "Специалист по анализу программного обеспечения",
        courses: ["Обратная инженерия", "Анализ вредоносного ПО", "Памятьная форензика"]
    },
    "network": {
        name: "Сетевой специалист",
        description: "Эксперт по сетевой безопасности",
        courses: ["Сетевой пентестинг и анализ трафика", "Безопасность беспроводных сетей", "Форензика и анализ цифровых следов"]
    },
    "crypto": {
        name: "Криптограф",
        description: "Специалист по криптографии и защите данных",
        courses: ["Криптография для начинающих", "Продвинутая криптография", "Введение в CTF"]
    },
    "forensics": {
        name: "Киберфорензик",
        description: "Специалист по расследованию киберинцидентов",
        courses: ["Форензика и анализ цифровых следов", "Памятьная форензика", "Основы Linux для пентестеров"]
    }
};

// ========== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ==========
async function initializePage() {
    console.log('🚀 Инициализация страницы...');
    
    try {
        // Загружаем курсы
        const courses = await loadCourses();
        console.log('✅ Загружено курсов:', courses.length);
        
        // Заполняем базу данных
        fillCoursesDatabase(courses);
        
        // Рендерим курсы
        renderCourses(courses);
        
        // Инициализируем остальные компоненты
        initCart();
        setupEventListeners();
        
        console.log('✅ Страница успешно инициализирована');
        showNotification('Добро пожаловать в CTF Courses!', 'success');
        
    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        showNotification('Ошибка загрузки страницы', 'error');
    }
}

// ========== ЗАГРУЗКА КУРСОВ ==========
async function loadCourses() {
    try {
        console.log('🔄 Попытка загрузки из API...');
        const response = await fetch('https://web-server-qywt.onrender.com/api/courses');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const courses = await response.json();
        console.log('✅ API курсы загружены:', courses);
        return courses;
        
    } catch (error) {
        console.warn('⚠️ API недоступно, используем локальные данные');
        return getLocalCourses();
    }
}



function fillCoursesDatabase(courses) {
    coursesDatabase = {};
    courses.forEach(course => {
        coursesDatabase[course.name] = course;
    });
    console.log('📊 База данных заполнена:', Object.keys(coursesDatabase).length, 'курсов');
}

// ========== РЕНДЕРИНГ КУРСОВ ==========
function renderCourses(courses) {
    const container = document.getElementById('coursesContainer');
    if (!container) {
        console.error('❌ Контейнер курсов не найден!');
        return;
    }

    container.innerHTML = '';

    if (!courses || courses.length === 0) {
        container.innerHTML = '<p class="no-courses">Курсы не найдены</p>';
        return;
    }

    courses.forEach(course => {
        const courseElement = createCourseElement(course);
        container.appendChild(courseElement);
    });

    updateCoursesCounter(courses.length);
}

function createCourseElement(course) {
    const element = document.createElement('div');
    element.className = 'course-item';
    element.setAttribute('data-categories', course.category);
    element.setAttribute('data-difficulty', course.difficulty);
    element.setAttribute('data-price', course.price);
    element.setAttribute('data-duration', course.duration);
    element.setAttribute('data-rating', course.rating);

    element.innerHTML = `
        <div class="course-image">
            <img src="${course.image}" alt="${course.name}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+0JLQstC10LTQuNGC0Ysg0LIgQ1RGPC90ZXh0Pjwvc3ZnPg=='">
        </div>
        <div class="course-badge ${course.difficulty}">
            ${getDifficultyText(course.difficulty)}
        </div>
        <div class="course-title">${course.name}</div>
        <div class="course-meta">
            <span class="course-price">${course.price.toLocaleString()} ₽</span>
            <span class="course-duration">${course.duration} часов</span>
            <span class="course-rating">⭐ ${course.rating}</span>
        </div>
        <div class="course-description">${course.description}</div>
        <div class="course-actions">
            <button class="add-button" onclick="addToCart('${course.name}')">
                Добавить в корзину
            </button>
            <button class="recommend-button" onclick="showRecommendations('${course.category}')">
                Рекомендовать профессию
            </button>
        </div>
    `;

    return element;
}

function getDifficultyText(difficulty) {
    const map = {
        'beginner': 'Для начинающих',
        'intermediate': 'Средний уровень', 
        'advanced': 'Продвинутый'
    };
    return map[difficulty] || 'Неизвестно';
}

// ========== КОРЗИНА ==========
function initCart() {
    const saved = localStorage.getItem('selectedCourses');
    if (saved) {
        try {
            selectedCourses = JSON.parse(saved);
        } catch (e) {
            selectedCourses = [];
        }
    }
    updateCartUI();
    setupCartCounter();
}

function addToCart(courseName) {
    const course = coursesDatabase[courseName];
    if (!course) {
        showNotification('Курс не найден', 'error');
        return;
    }

    const exists = selectedCourses.find(c => c.name === courseName);
    if (exists) {
        showNotification('Курс уже в корзине', 'warning');
        return;
    }

    selectedCourses.push({
        name: course.name,
        description: course.description,
        price: course.price
    });

    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    updateCartUI();
    showNotification(`"${course.name}" добавлен в корзину!`, 'success');
}

function updateCartUI() {
    const button = document.getElementById('payButton');
    if (button) {
        if (selectedCourses.length > 0) {
            button.style.display = 'inline-block';
            button.textContent = `Оплатить (${selectedCourses.length})`;
        } else {
            button.style.display = 'none';
        }
    }
    updateCartCounter();
}

function setupCartCounter() {
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    
    if (!document.getElementById('cartCounter')) {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            <a href="#" onclick="viewCart(); return false;" style="position: relative; display: flex; align-items: center;">
                🛒 Корзина
                <span id="cartCounter" style="display: none; position: absolute; top: -8px; right: -8px; background: #dc3545; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 12px; text-align: center; line-height: 18px; font-weight: bold;">0</span>
            </a>
        `;
        nav.appendChild(cartItem);
    }
    updateCartCounter();
}

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

function viewCart() {
    if (selectedCourses.length === 0) {
        showNotification('Корзина пуста!', 'info');
        return;
    }
    const modal = createCartModal();
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

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

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function removeFromCart(index) {
    if (index < 0 || index >= selectedCourses.length) {
        showNotification('Ошибка: курс не найден в корзине', 'error');
        return;
    }
    
    const removedCourse = selectedCourses[index];
    selectedCourses.splice(index, 1);
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    updateCartUI();
    
    const modal = document.getElementById('cartModal');
    if (modal) {
        if (selectedCourses.length === 0) {
            closeCartModal();
            showNotification('Корзина пуста!', 'info');
        } else {
            closeCartModal();
            viewCart();
        }
    }
    
    showNotification(`Курс "${removedCourse.name}" удален из корзины`, 'info');
}

// ========== ФУНКЦИИ РЕКОМЕНДАЦИЙ ==========
function showRecommendations(category) {
    const combo = courseCombos[category];
    if (!combo) {
        showNotification('Профессия не найдена', 'error');
        return;
    }

    const recommendationsContainer = document.getElementById('recommendations');
    const recommendedCoursesContainer = document.getElementById('recommendedCourses');
    
    if (!recommendationsContainer || !recommendedCoursesContainer) {
        showNotification('Контейнер рекомендаций не найден', 'error');
        return;
    }
    
    recommendedCoursesContainer.innerHTML = '';
    
    let addedCourses = 0;
    combo.courses.forEach(courseName => {
        const courseInfo = coursesDatabase[courseName];
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
    
    recommendationsContainer.querySelector('h3').textContent = `🎯 Рекомендуемые курсы для профессии: ${combo.name}`;
    recommendationsContainer.style.display = 'block';
    recommendationsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNotification(`Показаны рекомендации для: ${combo.name}`, 'info');
}

function createRecommendedCourseElement(courseName, courseInfo) {
    const courseElement = document.createElement('div');
    courseElement.className = 'course-item';
    courseElement.innerHTML = `
        <div class="course-image">
            <img src="${courseInfo.image}" alt="${courseName}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaHepZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+0JLQstC10LTQuNGC0Ysg0LIgQ1RGPC90ZXh0Pjwvc3ZnPg=='">
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
            <button class="add-button" onclick="addToCart('${courseName}')">
                Добавить в корзину
            </button>
        </div>
    `;
    return courseElement;
}

function closeRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations');
    if (recommendationsContainer) {
        recommendationsContainer.style.display = 'none';
    }
    showNotification('Рекомендации закрыты', 'info');
}

function addAllRecommendedCourses() {
    const recommendationsContainer = document.getElementById('recommendations');
    if (!recommendationsContainer) return;
    
    const title = recommendationsContainer.querySelector('h3').textContent;
    const professionName = title.replace('🎯 Рекомендуемые курсы для профессии: ', '');
    const targetCombo = findComboByName(professionName);
    
    if (!targetCombo) {
        showNotification('Не удалось найти профессию', 'error');
        return;
    }
    
    let addedCount = 0;
    let alreadyAdded = 0;
    
    targetCombo.courses.forEach(courseName => {
        const courseInfo = coursesDatabase[courseName];
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
    
    if (addedCount > 0) {
        localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
        updateCartUI();
    }
    
    if (addedCount > 0 && alreadyAdded > 0) {
        showNotification(`Добавлено ${addedCount} новых курсов. ${alreadyAdded} уже были в корзине.`, 'success');
    } else if (addedCount > 0) {
        showNotification(`Все ${addedCount} курсов добавлены в корзину!`, 'success');
    } else if (alreadyAdded > 0) {
        showNotification('Все курсы для этой профессии уже в корзине!', 'warning');
    } else {
        showNotification('Не удалось добавить курсы', 'error');
    }
}

function findComboByName(professionName) {
    for (const [key, combo] of Object.entries(courseCombos)) {
        if (combo.name === professionName) {
            return combo;
        }
    }
    return null;
}

// ========== ФИЛЬТРАЦИЯ ==========
function setupEventListeners() {
    // Фильтры по категориям
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            applyFilters();
        });
    });

    // Выпадающие фильтры
    ['difficultyFilter', 'priceFilter', 'durationFilter', 'sortFilter'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });

    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

function applyFilters() {
    updateCurrentFilters();
    
    const courses = document.querySelectorAll('.course-item');
    let visibleCount = 0;

    courses.forEach(course => {
        const show = shouldShowCourse(course);
        course.style.display = show ? 'flex' : 'none';
        if (show) visibleCount++;
    });

    updateCoursesCounter(visibleCount);
}
function filterCourses(category, event) {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Если event не передан, находим кнопку по категории
        const button = document.querySelector(`.filter-button[data-category="${category}"]`);
        if (button) {
            button.classList.add('active');
        }
    }
    
    applyFilters();
}
function updateCurrentFilters() {
    currentFilters = {
        category: document.querySelector('.filter-button.active')?.dataset.category || 'all',
        difficulty: document.getElementById('difficultyFilter').value,
        price: document.getElementById('priceFilter').value,
        duration: document.getElementById('durationFilter').value,
        sort: document.getElementById('sortFilter').value,
        search: document.getElementById('searchInput')?.value.toLowerCase().trim() || ''
    };
}

function shouldShowCourse(course) {
    const data = {
        categories: course.dataset.categories,
        difficulty: course.dataset.difficulty,
        price: parseInt(course.dataset.price),
        duration: parseInt(course.dataset.duration),
        title: course.querySelector('.course-title').textContent.toLowerCase(),
        description: course.querySelector('.course-description').textContent.toLowerCase()
    };

    // Проверка категории
    if (currentFilters.category !== 'all' && !data.categories.includes(currentFilters.category)) {
        return false;
    }

    // Проверка сложности
    if (currentFilters.difficulty !== 'all' && data.difficulty !== currentFilters.difficulty) {
        return false;
    }

    // Проверка цены
    if (currentFilters.price !== 'all') {
        const price = data.price;
        if (currentFilters.price === 'budget' && price > 4000) return false;
        if (currentFilters.price === 'medium' && (price <= 4000 || price > 6000)) return false;
        if (currentFilters.price === 'premium' && price <= 6000) return false;
    }

    // Проверка продолжительности
    if (currentFilters.duration !== 'all') {
        const duration = data.duration;
        if (currentFilters.duration === 'short' && duration > 20) return false;
        if (currentFilters.duration === 'medium' && (duration <= 20 || duration > 40)) return false;
        if (currentFilters.duration === 'long' && duration <= 40) return false;
    }

    // Поиск
    if (currentFilters.search) {
        const search = currentFilters.search;
        if (!data.title.includes(search) && !data.description.includes(search)) {
            return false;
        }
    }

    return true;
}

function updateCoursesCounter(count) {
    const counter = document.getElementById('coursesCount');
    if (counter) {
        counter.textContent = count;
    }
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showNotification(message, type = 'info') {
    // Простая реализация уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        z-index: 1001;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545', 
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function proceedToPayment() {
    if (selectedCourses.length === 0) {
        showNotification('Корзина пуста! Выберите хотя бы один курс.', 'error');
        return false;
    }
    
    // Сохраняем выбранные курсы в localStorage для страницы оплаты
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    
    // Показываем уведомление
    showNotification('Переход к оплате...', 'info');
    
    // Перенаправляем на страницу оплаты через 1 секунду
    setTimeout(() => {
        window.location.href = 'payment.html';
    }, 1000);
    
    return true;
}

function clearAllFilters() {
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.filter-button[data-category="all"]').classList.add('active');

    document.getElementById('difficultyFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('durationFilter').value = 'all';
    document.getElementById('sortFilter').value = 'default';
    document.getElementById('searchInput').value = '';

    currentFilters = {
        category: 'all',
        difficulty: 'all',
        price: 'all', 
        duration: 'all',
        sort: 'default',
        search: ''
    };

    applyFilters();
    showNotification('Все фильтры сброшены', 'info');
}

// ========== ЭКСПОРТ ФУНКЦИЙ ==========
window.addToCart = addToCart;
window.proceedToPayment = proceedToPayment;
window.applyFilters = applyFilters;
window.viewCart = viewCart;
window.closeCartModal = closeCartModal;
window.removeFromCart = removeFromCart;
window.showRecommendations = showRecommendations;
window.closeRecommendations = closeRecommendations;
window.addAllRecommendedCourses = addAllRecommendedCourses;
window.clearAllFilters = clearAllFilters;
window.filterCourses = filterCourses;
// ЗАПУСК
document.addEventListener('DOMContentLoaded', initializePage);