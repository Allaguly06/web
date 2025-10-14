// Обработка оплаты
async function processPayment() {
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
    
    // Получаем выбранные курсы
    const savedCourses = localStorage.getItem('selectedCourses');
    if (!savedCourses) {
        alert('Нет данных о выбранных курсах!');
        return;
    }
    
    const selectedCourses = JSON.parse(savedCourses);
    const totalAmount = selectedCourses.reduce((sum, course) => sum + course.price, 0);
    
    // Собираем данные для отправки
    const orderData = {
        customer: {
            name: cardholder,
            email: "customer@example.com", // Можно добавить поле email в форму
            payment_method: "card",
            card_last_four: cardNumber.slice(-4)
        },
        courses: selectedCourses.map(course => ({
            id: course.id,
            name: course.name,
            price: course.price
        })),
        total_amount: totalAmount
    };
    
    try {
        // Показываем индикатор загрузки
        const payButton = document.querySelector('.pay-button');
        const originalText = payButton.textContent;
        payButton.textContent = 'Обработка...';
        payButton.disabled = true;
        
        // Отправляем запрос на сервер
        const response = await fetch('http://localhost:10000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
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
        alert(`Ошибка оплаты: ${error.message}. Пожалуйста, попробуйте еще раз.`);
        
        // Восстанавливаем кнопку
        const payButton = document.querySelector('.pay-button');
        payButton.textContent = 'Оплатить';
        payButton.disabled = false;
    }
}