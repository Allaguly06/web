// cart.js - отдельный файл для работы с корзиной
let selectedCourses = [];

// Функция инициализации при загрузке страницы
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

// Функция добавления курса в корзину
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
        alert(`Курс "${courseName}" добавлен в корзину!`);
    } else {
        alert(`Курс "${courseName}" уже в корзине!`);
    }
}

// Функция получения цены курса
function getCoursePrice(courseName) {
    const prices = {
        "Введение в CTF": 2990,
        "Веб-уязвимости и пентестинг": 4990,
        "Обратная инженерия": 5990,
        "Криптография для начинающих": 3990,
        "Форензика и анализ цифровых следов": 5490
    };
    return prices[courseName] || 3990;
}

// Настройка счетчика корзины
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

// Обновление счетчика корзины
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

// Функция обновления интерфейса корзины
function updateCartUI() {
    console.log('Updating cart UI');
    
    const payButton = document.getElementById('payButton');
    if (payButton) {
        if (selectedCourses.length > 0) {
            payButton.style.display = 'block';
        } else {
            payButton.style.display = 'none';
        }
    }
    
    updateCartCounter();
}

// Функция перехода к оплате
function proceedToPayment() {
    console.log('Proceeding to payment');
    
    if (selectedCourses.length === 0) {
        alert('Корзина пуста! Выберите хотя бы один курс.');
        return false;
    }
    
    // Сохраняем данные в localStorage
    localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    
    // Перенаправляем на страницу оплаты
    window.location.href = 'payment.html';
    return true;
}

// Функция просмотра корзины
function viewCart() {
    console.log('Viewing cart');
    
    if (selectedCourses.length === 0) {
        alert('Корзина пуста!');
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
        <div style="background: white; padding: 20px; border-radius: 10px; width: 80%; max-width: 500px;">
            <h2>Ваша корзина</h2>
            <ul id="cartItemsList" style="list-style: none; padding: 0; margin-bottom: 20px;">
                ${selectedCourses.map((course, index) => `
                    <li id="cart-item-${index}" style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${course.name}</strong><br>
                            <small>${course.description.substring(0, 50)}...</small>
                        </div>
                        <div style="text-align: right;">
                            <div>${course.price} руб.</div>
                            <button onclick="removeFromCart(${index})" style="color: red; border: none; background: none; cursor: pointer; font-size: 12px;">Удалить</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
            <div style="font-size: 1.2em; font-weight: bold; text-align: right; margin-bottom: 20px;">
                Итого: ${total} руб.
            </div>
            <div style="display: flex; justify-content: space-between;">
                <button onclick="closeCartModal()" style="background: #ccc; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Продолжить покупки</button>
                <button onclick="proceedToPaymentFromCart()" style="background: darkblue; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Перейти к оплате</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Функция закрытия модального окна корзины
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.remove();
    }
}

// Функция для оплаты из модального окна корзины
function proceedToPaymentFromCart() {
    if (proceedToPayment()) {
        closeCartModal();
    }
}

// Функция удаления из корзины
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
                alert('Корзина пуста!');
            } else {
                // Удаляем элемент из DOM
                const itemToRemove = document.getElementById(`cart-item-${index}`);
                if (itemToRemove) {
                    itemToRemove.remove();
                }
                
                // Перерисовываем все оставшиеся элементы с правильными индексами
                const cartItemsList = document.getElementById('cartItemsList');
                cartItemsList.innerHTML = selectedCourses.map((course, newIndex) => `
                    <li id="cart-item-${newIndex}" style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${course.name}</strong><br>
                            <small>${course.description.substring(0, 50)}...</small>
                        </div>
                        <div style="text-align: right;">
                            <div>${course.price} руб.</div>
                            <button onclick="removeFromCart(${newIndex})" style="color: red; border: none; background: none; cursor: pointer; font-size: 12px;">Удалить</button>
                        </div>
                    </li>
                `).join('');
                
                // Обновляем итоговую сумму
                const total = selectedCourses.reduce((sum, course) => sum + course.price, 0);
                const totalElement = modal.querySelector('div[style*="font-size: 1.2em"]');
                if (totalElement) {
                    totalElement.textContent = `Итого: ${total} руб.`;
                }
            }
        }
        
        alert(`Курс "${removedCourse.name}" удален из корзины`);
    }
}

// Инициализация при полной загрузке DOM
document.addEventListener('DOMContentLoaded', initCart);