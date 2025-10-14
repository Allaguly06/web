// payment.js - обработка страницы оплаты
function initPayment() {
    console.log('Payment page initialized');
    
    // Получаем выбранные курсы из localStorage
    let selectedCourses = [];
    const savedCourses = localStorage.getItem('selectedCourses');
    
    console.log('Saved courses from localStorage:', savedCourses);
    
    if (savedCourses) {
        try {
            selectedCourses = JSON.parse(savedCourses);
            console.log('Parsed courses:', selectedCourses);
            
            // Проверяем структуру данных
            if (Array.isArray(selectedCourses) && selectedCourses.length > 0) {
                console.log('Valid courses array found');
            } else {
                console.log('Empty or invalid courses array');
            }
        } catch (e) {
            console.error('Error parsing courses:', e);
            alert('Ошибка загрузки данных курсов');
            window.location.href = 'services.html';
            return;
        }
    }
    
    if (!Array.isArray(selectedCourses) || selectedCourses.length === 0) {
        console.log('No courses found in localStorage');
        alert('Нет выбранных курсов! Возвращаемся к выбору курсов.');
        setTimeout(() => {
            window.location.href = 'services.html';
        }, 1000);
        return;
    }
    
    // Отображаем выбранные курсы
    displaySelectedCourses(selectedCourses);
    
    // Настраиваем обработчик формы
    setupPaymentForm();
}

// Отображение выбранных курсов
function displaySelectedCourses(courses) {
    const coursesList = document.getElementById('selectedCoursesList');
    const totalElement = document.getElementById('totalAmount');
    
    if (!coursesList || !totalElement) {
        console.error('Required elements not found');
        return;
    }
    
    coursesList.innerHTML = '';
    let total = 0;
    
    console.log('Displaying courses:', courses);
    
    courses.forEach((course, index) => {
        const li = document.createElement('li');
        
        // Проверяем структуру объекта курса (ваша структура из cart.js)
        const courseName = course.name || 'Неизвестный курс';
        const coursePrice = course.price || 0;
        const courseDescription = course.description || '';
        
        li.innerHTML = `
            <div class="course-item-payment">
                <strong>${courseName}</strong>
                <div class="course-description">${courseDescription.substring(0, 80)}...</div>
                <div class="course-price">${coursePrice.toLocaleString()} руб.</div>
            </div>
        `;
        coursesList.appendChild(li);
        total += coursePrice;
    });
    
    totalElement.textContent = total.toLocaleString();
    console.log('Total calculated:', total);
}

// Настройка обработчика формы оплаты
function setupPaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    
    if (!paymentForm) {
        console.error('Payment form not found');
        return;
    }
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment();
    });
    
    // Добавляем маску для номера карты
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }
    
    // Добавляем маску для срока действия
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }
    
    // Маска для CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 3) value = value.slice(0, 3);
            e.target.value = value;
        });
    }
}

// Обработка оплаты с отправкой на сервер
async function processPayment() {
    // Получаем данные формы
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardholder = document.getElementById('cardholder').value.trim();
    
    // Валидация полей
    if (!cardNumber || !expiryDate || !cvv || !cardholder) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }
    
    // Валидация номера карты
    if (cardNumber.length !== 16) {
        alert('Номер карты должен содержать 16 цифр');
        return;
    }
    
    // Валидация CVV
    if (cvv.length !== 3) {
        alert('CVV код должен содержать 3 цифры');
        return;
    }
    
    // Валидация срока действия
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Неверный формат срока действия. Используйте ММ/ГГ');
        return;
    }
    
    // Получаем выбранные курсы
    const savedCourses = localStorage.getItem('selectedCourses');
    if (!savedCourses) {
        alert('Нет данных о выбранных курсах!');
        return;
    }
    
    const selectedCourses = JSON.parse(savedCourses);
    const totalAmount = selectedCourses.reduce((sum, course) => sum + course.price, 0);
    
    // Собираем данные для отправки на сервер
    const orderData = {
        customer: {
            name: cardholder,
            email: "customer@example.com",
            payment_method: "card",
            card_last_four: cardNumber.slice(-4)
        },
        courses: selectedCourses.map(course => ({
            id: course.id || Date.now(),
            name: course.name,
            price: course.price,
            description: course.description
        })),
        total_amount: totalAmount,
        payment_details: {
            card_number: cardNumber.slice(-4),
            expiry_date: expiryDate
        }
    };
    
    try {
        // Показываем индикатор загрузки
        const payButton = document.querySelector('.pay-button');
        const originalText = payButton.textContent;
        payButton.textContent = 'Обработка оплаты...';
        payButton.disabled = true;
        
        console.log('Sending order data:', orderData);
        
        // ИСПРАВЛЕННЫЙ URL - теперь отправляем на /api/orders
        const response = await fetch('https://web-server-qywt.onrender.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Server response:', result);
        
        if (result.success) {
            // Успешная оплата
            alert(`Оплата прошла успешно! Заказ №${result.order_id} создан. На вашу почту отправлены материалы курсов.`);
            
            // Очищаем корзину
            localStorage.removeItem('selectedCourses');
            
            // Перенаправляем на главную страницу
            setTimeout(() => {
                window.location.href = '../pg/Index.html';
            }, 2000);
        } else {
            // Ошибка от сервера
            throw new Error(result.error || 'Неизвестная ошибка сервера');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        
        // Более информативное сообщение об ошибке
        let errorMessage = 'Ошибка оплаты: ';
        
        if (error.message.includes('Failed to fetch')) {
            errorMessage += 'Не удалось подключиться к серверу. Проверьте подключение к интернету.';
        } else if (error.message.includes('HTTP error')) {
            errorMessage += 'Ошибка сервера. Попробуйте позже.';
        } else {
            errorMessage += error.message;
        }
        
        alert(errorMessage);
        
        // Восстанавливаем кнопку
        const payButton = document.querySelector('.pay-button');
        payButton.textContent = originalText;
        payButton.disabled = false;
    }
}

// Функция для проверки localStorage (для отладки)
function checkLocalStorage() {
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('selectedCourses:', localStorage.getItem('selectedCourses'));
    console.log('all localStorage:', { ...localStorage });
    console.log('========================');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing payment...');
    checkLocalStorage();
    initPayment();
});

// Добавляем стили для отображения курсов на странице оплаты
const style = document.createElement('style');
style.textContent = `
    .course-item-payment {
        padding: 10px;
        margin: 8px 0;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #f9f9f9;
    }
    
    .course-item-payment .course-description {
        font-size: 12px;
        color: #666;
        margin: 5px 0;
    }
    
    .course-item-payment .course-price {
        font-weight: bold;
        color: darkblue;
        text-align: right;
    }
    
    #selectedCoursesList {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    #selectedCoursesList li {
        margin-bottom: 10px;
    }
`;
document.head.appendChild(style);