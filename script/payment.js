// payment.js - обработка страницы оплаты
function initPayment() {
    console.log('Payment page initialized');
    
    // Получаем выбранные курсы из localStorage
    let selectedCourses = [];
    const savedCourses = localStorage.getItem('selectedCourses');
    
    if (savedCourses) {
        try {
            selectedCourses = JSON.parse(savedCourses);
            console.log('Loaded courses:', selectedCourses);
        } catch (e) {
            console.error('Error parsing courses:', e);
            alert('Ошибка загрузки данных курсов');
            window.location.href = 'services.html';
            return;
        }
    }
    
    if (selectedCourses.length === 0) {
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
    
    courses.forEach(course => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${course.name}</strong> - ${course.price} руб.`;
        coursesList.appendChild(li);
        total += course.price;
    });
    
    totalElement.textContent = total;
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
}

// Обработка оплаты
function processPayment() {
    // Простая валидация
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardholder = document.getElementById('cardholder').value.trim();
    
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
    
    // Имитация успешной оплаты
    alert('Оплата прошла успешно! Спасибо за покупку! На вашу почту отправлены материалы курсов.');
    
    // Очищаем корзину
    localStorage.removeItem('selectedCourses');
    
    // Перенаправляем на главную страницу
    setTimeout(() => {
        window.location.href = '../pg/Index.html';
    }, 2000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initPayment);