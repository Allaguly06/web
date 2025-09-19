// services.js - объединенный файл для работы с фильтрацией и корзиной

// ========== ПЕРЕМЕННЫЕ ==========
let selectedCourses = [];

// ========== ФУНКЦИИ ФИЛЬТРАЦИИ КУРСОВ ==========

/**
 * Фильтрация курсов по категориям
 * @param {string} category - Категория для фильтрации
 */
function filterCourses(category) {
    const courses = document.querySelectorAll('.course-item');
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // Обновляем активную кнопку
    filterButtons.forEach(button => {
        if (button.dataset.category === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Показываем/скрываем курсы в зависимости от категории
    courses.forEach(course => {
        if (category === 'all' || course.dataset.categories.includes(category)) {
            course.classList.remove('hidden');
        } else {
            course.classList.add('hidden');
        }
    });
}

// ========== ФУНКЦИИ КОРЗИНЫ ==========

/**
 * Инициализация корзины при загрузке страницы
 */
function initCart() {
    console.log('Cart initialized');
    
    // Восстанавливаем корзину из localStorage
    const savedCart = localStorage.getItem('selectedCourses');
    if (savedCart) {
        try {
            selectedCourses = JSON.parse(savedCart);
            console.log('Restored cart:', selectedCourses);
        } catch (e) {
            console.error('Error parsing cart data:', e);
            selectedCourses = [];
        }
    }
    
    updateCartUI();
    setupCartCounter();
}

/**
 * Добавление курса в корзину
 * @param {string} courseName - Название курса
 * @param {string} courseDescription - Описание курса
 */
function addToCourse(courseName, courseDescription) {
    console.log('Adding course:', courseName);
    
    // Проверяем, не добавлен ли уже курс
    const isAlreadyAdded = selectedCourses.some(course => course.name === courseName);
    
    if (!isAlreadyAdded) {
        selectedCourses.push({
            name: courseName,
            description: courseDescription,
            price: getCoursePrice(courseName)
        });
        
        // Сохраняем в localStorage
        localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
        
        updateCartUI();
        showNotification(`Курс "${courseName}" добавлен в корзину!`, 'success');
    } else {
        showNotification(`Курс "${courseName}" уже в корзине!`, 'warning');
    }
}

/**
 * Получение цены курса
 * @param {string} courseName - Название курса
 * @returns {number} - Цена курса
 */
function getCoursePrice(courseName) {
    const prices = {
        "Введение в CTF": 2990,
        "Веб-уязвимости и пентестинг": 4990,
        "Обратная инженерия": 5990,
        "Криптография для начинающих": 3990,
        "Форензика и анализ цифровых следов": 5490,
        "Сетевой пентестинг и анализ трафика": 5290,
        "Продвинутые веб-эксплойты": 6490,
        "Анализ вредоносного ПО": 6990,
        "Продвинутая криптография": 5990,
        "Памятьная форензика": 5790,
        "Основы Linux для пентестеров": 3490,
        "Безопасность беспроводных сетей": 4990
    };
    return prices[courseName] || 3990;
}

/**
 * Настройка счетчика корзины в навигации
 */
function setupCartCounter() {
    const nav = document.querySelector('nav ul');
    if (nav && !document.getElementById('cartCounter')) {
        const cartItem = document.createElement('li');
        cartItem.innerHTML = `
            <a href="#" onclick="viewCart(); return false;" style="position: relative;">
                Корзина
                <span id="cartCounter" style="display: none; position: absolute; top: -8px; right: -8px; background: red; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 12px; text-align: center; line-height: 18px;">0</span>
            </a>
        `;
        nav.appendChild(cartItem);
    }
    updateCartCounter();
}

/**
 * Обновление счетчика корзины
 */
function updateCartCounter() {
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        if (selectedCourses.length > 0) {
            cartCounter.textContent = selectedCourses.length;
            cartCounter.style.display = 'inline-block';
        } else {
            cartCounter.style.display = 'none';
        }
    }
}

/**
 * Обновление интерфейса корзины
 */
function updateCartUI() {
    console.log('Updating cart UI');
    
    const payButton = document.getElementById('payButton');
    if (payButton) {
        if (selectedCourses.length > 0) {
            payButton.style.display = 'inline-block';
        } else {
            payButton.style.display = 'none';
        }
    }
    
    updateCartCounter();
}

/**
 * Переход к оплате
 * @returns {boolean} - Результат операции
 */
function proceedToPayment() {
    console.log('Proceeding to payment');
    
    if (selectedCourses.length === 0) {
        showNotification('Корзина пуста! Выберите хотя бы один курс.', 'error');
        return false;
    }
    
    // Сохраняем данные в localStorage
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    
    // Перенаправляем на страницу оплаты
    window.location.href = 'payment.html';
    return true;
}

/**
 * Просмотр содержимого корзины
 */
function viewCart() {
    console.log('Viewing cart');
    
    if (selectedCourses.length === 0) {
        showNotification('Корзина пуста!', 'info');
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    const total = selectedCourses.reduce((sum, course) => sum + course.price, 0);
    
    modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; width: 80%; max-width: 500px; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Ваша корзина</h2>
                <button onclick="closeCartModal()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
            </div>
            <ul id="cartItemsList" style="list-style: none; padding: 0; margin-bottom: 20px;">
                ${selectedCourses.map((course, index) => `
                    <li id="cart-item-${index}" style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <strong>${course.name}</strong><br>
                            <small style="color: #666;">${course.description.substring(0, 50)}...</small>
                        </div>
                        <div style="text-align: right; margin-left: 15px;">
                            <div style="font-weight: bold;">${course.price.toLocaleString()} руб.</div>
                            <button onclick="removeFromCart(${index})" style="color: red; border: none; background: none; cursor: pointer; font-size: 12px; margin-top: 5px;">Удалить</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
            <div style="font-size: 1.2em; font-weight: bold; text-align: right; margin-bottom: 20px; padding-top: 10px; border-top: 2px solid #ddd;">
                Итого: ${total.toLocaleString()} руб.
            </div>
            <div style="display: flex; justify-content: space-between; gap: 10px;">
                <button onclick="closeCartModal()" style="background: #ccc; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; flex: 1;">Продолжить покупки</button>
                <button onclick="proceedToPaymentFromCart()" style="background: darkblue; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; flex: 1;">Перейти к оплате</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Блокируем прокрутку фонового контента
    document.body.style.overflow = 'hidden';
}

/**
 * Закрытие модального окна корзины
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
 * Оплата из модального окна корзины
 */
function proceedToPaymentFromCart() {
    if (proceedToPayment()) {
        closeCartModal();
    }
}

/**
 * Удаление курса из корзины
 * @param {number} index - Индекс курса в корзине
 */
function removeFromCart(index) {
    if (index >= 0 && index < selectedCourses.length) {
        const removedCourse = selectedCourses[index];
        selectedCourses.splice(index, 1);
        
        // Обновляем localStorage
        localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
        
        updateCartUI();
        
        // Обновляем модальное окно корзины
        const modal = document.getElementById('cartModal');
        if (modal) {
            if (selectedCourses.length === 0) {
                closeCartModal();
                showNotification('Корзина пуста!', 'info');
            } else {
                // Перерисовываем весь список
                const total = selectedCourses.reduce((sum, course) => sum + course.price, 0);
                
                modal.innerHTML = `
                    <div style="background: white; padding: 20px; border-radius: 10px; width: 80%; max-width: 500px; max-height: 80vh; overflow-y: auto;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h2 style="margin: 0;">Ваша корзина</h2>
                            <button onclick="closeCartModal()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                        </div>
                        <ul id="cartItemsList" style="list-style: none; padding: 0; margin-bottom: 20px;">
                            ${selectedCourses.map((course, newIndex) => `
                                <li id="cart-item-${newIndex}" style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                                    <div style="flex: 1;">
                                        <strong>${course.name}</strong><br>
                                        <small style="color: #666;">${course.description.substring(0, 50)}...</small>
                                    </div>
                                    <div style="text-align: right; margin-left: 15px;">
                                        <div style="font-weight: bold;">${course.price.toLocaleString()} руб.</div>
                                        <button onclick="removeFromCart(${newIndex})" style="color: red; border: none; background: none; cursor: pointer; font-size: 12px; margin-top: 5px;">Удалить</button>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                        <div style="font-size: 1.2em; font-weight: bold; text-align: right; margin-bottom: 20px; padding-top: 10px; border-top: 2px solid #ddd;">
                            Итого: ${total.toLocaleString()} руб.
                        </div>
                        <div style="display: flex; justify-content: space-between; gap: 10px;">
                            <button onclick="closeCartModal()" style="background: #ccc; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; flex: 1;">Продолжить покупки</button>
                            <button onclick="proceedToPaymentFromCart()" style="background: darkblue; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; flex: 1;">Перейти к оплате</button>
                        </div>
                    </div>
                `;
            }
        }
        
        showNotification(`Курс "${removedCourse.name}" удален из корзины`, 'info');
    }
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Показ уведомлений
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип уведомления (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Удаляем предыдущее уведомление, если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    // Стили для уведомления
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.zIndex = '1001';
    notification.style.maxWidth = '300px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    // Цвета в зависимости от типа
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 3 секунды
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
    }, 3000);
}

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

/**
 * Обработчик клика по кнопкам фильтрации
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
 * Обработчик клика вне модального окна
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
 * Обработчик клавиши Escape для закрытия модального окна
 */
function setupEscapeHandler() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeCartModal();
        }
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ==========

/**
 * Основная функция инициализации
 */
function initializePage() {
    console.log('Initializing page...');
    
    // Инициализация фильтрации
    setupFilterHandlers();
    
    // Инициализация корзины
    initCart();
    
    // Настройка обработчиков модального окна
    setupModalCloseHandler();
    setupEscapeHandler();
    
    // Устанавливаем фильтр "Все курсы" по умолчанию
    filterCourses('all');
    
    console.log('Page initialized successfully');
}

// Запуск инициализации при полной загрузке DOM
document.addEventListener('DOMContentLoaded', initializePage);

// ========== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ HTML ==========
// Делаем функции доступными глобально для вызова из HTML
window.addToCourse = addToCourse;
window.proceedToPayment = proceedToPayment;
window.viewCart = viewCart;
window.closeCartModal = closeCartModal;
window.proceedToPaymentFromCart = proceedToPaymentFromCart;
window.removeFromCart = removeFromCart;
window.filterCourses = filterCourses;