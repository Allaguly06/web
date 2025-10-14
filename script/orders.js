// orders.js - управление страницей заказов с реальным API
let orders = [];
let currentOrderId = null;
const API_BASE_URL = 'https://web-server-qywt.onrender.com/api';

// Инициализация страницы
async function initializeOrdersPage() {
    console.log('Инициализация страницы заказов...');
    
    try {
        // Показываем индикатор загрузки
        showLoadingIndicator();
        
        await loadOrders();
        renderOrdersTable();
        setupEventListeners();
        
        hideLoadingIndicator();
        console.log('Страница заказов успешно инициализирована');
        
    } catch (error) {
        console.error('Ошибка инициализации страницы заказов:', error);
        hideLoadingIndicator();
        showNotification('Ошибка загрузки заказов', 'error');
    }
}

// Показать индикатор загрузки
function showLoadingIndicator() {
    const tableBody = document.getElementById('ordersTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                        <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid darkblue; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <p style="color: #666; margin: 0;">Загрузка заказов...</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Скрыть индикатор загрузки
function hideLoadingIndicator() {
    // Автоматически скроется при рендеринге таблицы
}

// Загрузка заказов с сервера
async function loadOrders() {
    try {
        console.log('📥 Загрузка заказов с сервера...');
        
        const response = await fetch(`${API_BASE_URL}/orders`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        orders = await response.json();
        console.log(`Загружено заказов: ${orders.length}`);
        
        // Сортировка по дате (новые сначала)
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        return orders;
        
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        showNotification('Ошибка загрузки заказов с сервера', 'error');
        orders = [];
        throw error;
    }
}

// Загрузка конкретного заказа
async function loadOrder(orderId) {
    try {
        console.log(`📥 Загрузка заказа: ${orderId}`);
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const order = await response.json();
        console.log(`Заказ загружен: ${orderId}`);
        return order;
        
    } catch (error) {
        console.error(`Ошибка загрузки заказа ${orderId}:`, error);
        throw error;
    }
}

// Обновление заказа
async function updateOrder(orderId, updateData) {
    try {
        console.log(`Обновление заказа: ${orderId}`, updateData);
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`Заказ обновлен: ${orderId}`);
        return result;
        
    } catch (error) {
        console.error(`Ошибка обновления заказа ${orderId}:`, error);
        throw error;
    }
}

// Удаление заказа
async function deleteOrderFromServer(orderId) {
    try {
        console.log(`Отправка запроса на удаление заказа: ${orderId}`);
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
            method: 'DELETE'
        });
        
        console.log(`Ответ сервера: ${response.status}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Заказ успешно удален с сервера:', result);
        
        return result;
        
    } catch (error) {
        console.error('Ошибка удаления заказа:', error);
        throw error;
    }
}

// Рендеринг таблицы заказов
function renderOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    const emptyOrders = document.getElementById('emptyOrders');
    
    if (!tableBody || !emptyOrders) {
        console.error('Не найдены необходимые элементы DOM');
        return;
    }
    
    if (orders.length === 0) {
        tableBody.innerHTML = '';
        emptyOrders.style.display = 'block';
        console.log('ℹ️ Нет заказов для отображения');
        return;
    }
    
    emptyOrders.style.display = 'none';
    tableBody.innerHTML = '';
    
    orders.forEach((order, index) => {
        const row = createTableRow(order, index);
        tableBody.appendChild(row);
    });
    
    console.log(`Отрисовано заказов: ${orders.length}`);
}

// Создание строки таблицы
function createTableRow(order, index) {
    const row = document.createElement('tr');
    
    const orderDate = new Date(order.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const coursesList = order.courses.map(course => course.name).join(', ');
    const totalAmount = order.total_amount || order.courses.reduce((sum, course) => sum + course.price, 0);
    
    row.innerHTML = `
        <td data-label="№" class="order-number">${index + 1}</td>
        <td data-label="Дата заказа" class="order-date">${orderDate}</td>
        <td data-label="Состав заказа" class="order-courses">
            <ul class="order-courses-list">
                ${order.courses.map(course => `<li title="${course.description || ''}">${course.name}</li>`).join('')}
            </ul>
        </td>
        <td data-label="Стоимость" class="order-total">${totalAmount.toLocaleString()} руб.</td>
        <td data-label="Доставка" class="order-delivery">
            ${getDeliveryText(order.customer.delivery_type)}
        </td>
        <td data-label="Статус">
            <span class="order-status status-${order.status || 'paid'}">${getStatusText(order.status)}</span>
        </td>
        <td data-label="Действия">
            <div class="order-actions">
                <button class="action-btn btn-details" onclick="showOrderDetails('${order.id}')" title="Подробнее">
                    📋
                </button>
                <button class="action-btn btn-edit" onclick="editOrder('${order.id}')" title="Редактировать">
                    ✏️
                </button>
                <button class="action-btn btn-delete" onclick="showDeleteConfirm('${order.id}')" title="Удалить">
                    🗑️
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Получение текста доставки
function getDeliveryText(deliveryType) {
    const deliveryTypes = {
        'online': 'Онлайн доступ',
        'email': 'Email рассылка',
        'courier': 'Курьерская доставка'
    };
    return deliveryTypes[deliveryType] || 'Онлайн доступ';
}

// Получение текста статуса
function getStatusText(status) {
    const statusTypes = {
        'paid': 'Оплачен',
        'pending': 'В обработке',
        'cancelled': 'Отменен'
    };
    return statusTypes[status] || 'Оплачен';
}

// Показать детали заказа
async function showOrderDetails(orderId) {
    try {
        console.log(`🔍 Показать детали заказа: ${orderId}`);
        
        // Показываем индикатор загрузки в модальном окне
        const content = document.getElementById('orderDetailsContent');
        content.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid darkblue; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
                <p>Загрузка деталей заказа...</p>
            </div>
        `;
        
        const modal = document.getElementById('orderDetailsModal');
        modal.style.display = 'flex';
        
        const order = await loadOrder(orderId);
        
        const orderDate = new Date(order.created_at).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const updatedDate = order.updated_at ? new Date(order.updated_at).toLocaleDateString('ru-RU') : null;
        const totalAmount = order.total_amount || order.courses.reduce((sum, course) => sum + course.price, 0);
        
        content.innerHTML = `
            <div class="order-summary-details">
                <p><strong>ID заказа:</strong> ${order.id}</p>
                <p><strong>Дата заказа:</strong> ${orderDate}</p>
                <p><strong>Статус:</strong> <span class="order-status status-${order.status || 'paid'}">${getStatusText(order.status)}</span></p>
                <p><strong>ФИО:</strong> ${order.customer.name || 'Не указано'}</p>
                <p><strong>Email:</strong> ${order.customer.email || 'Не указан'}</p>
                <p><strong>Телефон:</strong> ${order.customer.phone || 'Не указан'}</p>
                <p><strong>Способ получения:</strong> ${getDeliveryText(order.customer.delivery_type)}</p>
                <p><strong>Адрес доставки:</strong> ${order.customer.delivery_address || 'Не указан'}</p>
                <p><strong>Время доставки:</strong> ${order.customer.delivery_time || 'Как можно скорее'}</p>
                ${order.customer.comment ? `<p><strong>Комментарий:</strong> ${order.customer.comment}</p>` : ''}
                ${updatedDate ? `<p><strong>Обновлен:</strong> ${updatedDate}</p>` : ''}
            </div>
            
            <h3>Состав заказа:</h3>
            ${order.courses.map(course => `
                <div class="course-item-detail">
                    <div>
                        <span class="course-name">${course.name}</span>
                        ${course.description ? `<div class="course-description">${course.description}</div>` : ''}
                    </div>
                    <span class="course-price">${course.price.toLocaleString()} руб.</span>
                </div>
            `).join('')}
            
            <div class="order-total-details">
                Итого: ${totalAmount.toLocaleString()} руб.
            </div>
        `;
        
    } catch (error) {
        console.error('❌ Ошибка загрузки деталей заказа:', error);
        const content = document.getElementById('orderDetailsContent');
        content.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                <h3>❌ Ошибка</h3>
                <p>Не удалось загрузить детали заказа</p>
                <p><small>${error.message}</small></p>
            </div>
        `;
    }
}

// Редактирование заказа
async function editOrder(orderId) {
    try {
        console.log(`✏️ Редактирование заказа: ${orderId}`);
        
        const order = await loadOrder(orderId);
        currentOrderId = orderId;
        
        // Заполняем форму данными заказа
        document.getElementById('editFullName').value = order.customer.name || '';
        document.getElementById('editEmail').value = order.customer.email || '';
        document.getElementById('editPhone').value = order.customer.phone || '';
        document.getElementById('editDeliveryAddress').value = order.customer.delivery_address || '';
        document.getElementById('editDeliveryType').value = order.customer.delivery_type || 'online';
        document.getElementById('editDeliveryTime').value = order.customer.delivery_time || '';
        document.getElementById('editComment').value = order.customer.comment || '';
        
        const modal = document.getElementById('editOrderModal');
        modal.style.display = 'flex';
        
    } catch (error) {
        console.error('❌ Ошибка загрузки заказа для редактирования:', error);
        showNotification('Ошибка загрузки заказа для редактирования', 'error');
    }
}

// Сохранение изменений заказа
async function saveOrderChanges() {
    if (!currentOrderId) {
        showNotification('Ошибка: ID заказа не указан', 'error');
        return;
    }
    
    const formData = {
        name: document.getElementById('editFullName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        delivery_address: document.getElementById('editDeliveryAddress').value.trim(),
        delivery_type: document.getElementById('editDeliveryType').value,
        delivery_time: document.getElementById('editDeliveryTime').value.trim(),
        comment: document.getElementById('editComment').value.trim()
    };
    
    // Валидация
    if (!formData.name) {
        showNotification('Введите ФИО', 'error');
        document.getElementById('editFullName').focus();
        return;
    }
    
    if (!formData.email) {
        showNotification('Введите email', 'error');
        document.getElementById('editEmail').focus();
        return;
    }
    
    if (!formData.phone) {
        showNotification('Введите телефон', 'error');
        document.getElementById('editPhone').focus();
        return;
    }
    
    try {
        // Показываем индикатор загрузки
        const saveButton = document.querySelector('.modal-btn-primary');
        const originalText = saveButton.textContent;
        saveButton.textContent = 'Сохранение...';
        saveButton.disabled = true;
        
        await updateOrder(currentOrderId, formData);
        
        showNotification('✅ Заказ успешно изменён', 'success');
        closeModal('editOrderModal');
        
        // Перезагружаем список заказов
        await loadOrders();
        renderOrdersTable();
        
    } catch (error) {
        console.error('❌ Ошибка обновления заказа:', error);
        showNotification(`❌ Ошибка при сохранении: ${error.message}`, 'error');
        
        // Восстанавливаем кнопку
        const saveButton = document.querySelector('.modal-btn-primary');
        saveButton.textContent = 'Сохранить';
        saveButton.disabled = false;
    }
}

// Подтверждение удаления заказа
function showDeleteConfirm(orderId) {
    currentOrderId = orderId;
    const modal = document.getElementById('deleteOrderModal');
    modal.style.display = 'flex';
    
    console.log(`❓ Подтверждение удаления заказа: ${orderId}`);
}

// Удаление заказа
async function confirmDeleteOrder() {
    if (!currentOrderId) {
        showNotification('Ошибка: ID заказа не указан', 'error');
        return;
    }
    
    try {
        // Показываем индикатор загрузки
        const deleteButton = document.querySelector('.modal-btn-danger');
        const originalText = deleteButton.textContent;
        deleteButton.textContent = 'Удаление...';
        deleteButton.disabled = true;
        
        await deleteOrderFromServer(currentOrderId);
        
        showNotification('✅ Заказ успешно удалён', 'success');
        closeModal('deleteOrderModal');
        
        // Перезагружаем список заказов
        await loadOrders();
        renderOrdersTable();
        
    } catch (error) {
        console.error('❌ Ошибка удаления заказа:', error);
        showNotification(`❌ Ошибка при удалении: ${error.message}`, 'error');
        
        // Восстанавливаем кнопку
        const deleteButton = document.querySelector('.modal-btn-danger');
        deleteButton.textContent = 'Да, удалить';
        deleteButton.disabled = false;
    }
}

// Закрытие модального окна
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
    currentOrderId = null;
    console.log(`📌 Модальное окно закрыто: ${modalId}`);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Закрытие модальных окон по клику вне области
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            currentOrderId = null;
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal('orderDetailsModal');
            closeModal('editOrderModal');
            closeModal('deleteOrderModal');
        }
    });
    
    // Предотвращение закрытия при клике внутри модального окна
    document.querySelectorAll('.modal-content').forEach(modalContent => {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    console.log('✅ Обработчики событий настроены');
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Удаляем предыдущие уведомления
    document.querySelectorAll('.notification').forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    
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
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .course-description {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
        line-height: 1.3;
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeOrdersPage);

// Экспортируем функции для глобального использования
window.showOrderDetails = showOrderDetails;
window.editOrder = editOrder;
window.showDeleteConfirm = showDeleteConfirm;
window.confirmDeleteOrder = confirmDeleteOrder;
window.closeModal = closeModal;
window.saveOrderChanges = saveOrderChanges;