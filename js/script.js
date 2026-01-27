// Наш "банк данных"
// let tasks = [
//     {
//         id: Date.now(),
//         text: "Создать первое приложение в MellowFlow",
//         isCompleted: false,
//         memo: "Использовать CSS Grid и Flexbox для верстки",
//         date: "2026-01-27"
//     }
// ];
let tasks = JSON.parse(localStorage.getItem('mellowTasks')) || [];

// Функция сохранения в память
function saveToLocalStorage() {
    localStorage.setItem('mellowTasks', JSON.stringify(tasks));
}

// 1. Находим список в HTML, куда будем добавлять задачи
const taskListElement = document.querySelector('.task-list');

// 2. Функция для отрисовки (рендера) задач на экран
function renderTasks() {
    taskListElement.innerHTML = ''; 

    tasks.forEach((task) => {
        // Создаем элемент списка
        const li = document.createElement('li');
        li.classList.add('task-list__item');
        li.setAttribute('data-id', task.id);

        // Генерируем внутренний HTML
        li.innerHTML = `
            <div class="task-list__main">
                <input type="checkbox" class="task-list__checkbox" ${task.isCompleted ? 'checked' : ''}>
                <span class="task-list__text ${task.isCompleted ? 'task-list__text--done' : ''}">
                    ${task.text}
                </span>
                <button class="task-list__memo-toggle">📝</button>
                <button class="task-list__btn--edit">✎</button>
                <button class="task-list__btn--delete">🗑</button>
            </div>
            <div class="task-list__memo ${task.isCompleted ? '' : 'task-list__memo--hidden'}">
                <div class="task-list__memo-content" contenteditable="true" placeholder="Добавьте описание...">${task.memo}</div>
                <button class="task-list__memo-save">Сохранить заметку</button>
            </div>
        `;

        taskListElement.appendChild(li);
    });
}

renderTasks();

// 1. Находим элементы ввода
const inputField = document.querySelector('.todo-input__field');
const addBtn = document.querySelector('.todo-input__add-btn');

// 2. Функция добавления задачи
function addTask() {
    const text = inputField.value.trim(); // trim убирает лишние пробелы

    if (text !== '') {
        // Создаем новый объект задачи
        const newTask = {
            id: Date.now(),
            text: text,
            isCompleted: false,
            memo: '', // Пока пустое мемо
            // memo: 'Это секретная заметка для задачи: ' + text,
            date: new Date().toISOString().split('T')[0] // Сегодняшняя дата
        };

        // Добавляем в массив
        tasks.push(newTask);
        saveToLocalStorage();

        // Очищаем поле ввода
        inputField.value = '';

        // Перерисовываем список
        renderTasks();
    }
}

// 3. Слушаем клик по кнопке
addBtn.addEventListener('click', addTask);

// 4. Слушаем нажатие Enter в инпуте
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

taskListElement.addEventListener('click', (e) => {
    // Ищем ближайший родительский li, у которого есть наш data-id
    const parentLi = e.target.closest('.task-list__item');
    if (!parentLi) return;
    
    const id = Number(parentLi.getAttribute('data-id'));

    // Если нажата кнопка удаления
    if (e.target.classList.contains('task-list__btn--delete')) {
        tasks = tasks.filter(task => task.id !== id); // Оставляем все задачи, кроме этой
        saveToLocalStorage();
        renderTasks();
    }

    // Если нажат чекбокс
    if (e.target.classList.contains('task-list__checkbox')) {
        const task = tasks.find(t => t.id === id);
        task.isCompleted = !task.isCompleted;
        saveToLocalStorage();
        renderTasks();
    }

    // Если нажата кнопка Мемо (📝)
    if (e.target.classList.contains('task-list__memo-toggle')) {
        // Находим блок мемо внутри текущей карточки
        const memoBlock = parentLi.querySelector('.task-list__memo');
        
        // Переключаем класс видимости
        memoBlock.classList.toggle('task-list__memo--active');
    }

    // Если нажата кнопка "Сохранить заметку"
    if (e.target.classList.contains('task-list__memo-save')) {
        const memoContent = parentLi.querySelector('.task-list__memo-content').innerText;
        const task = tasks.find(t => t.id === id);
        
        task.memo = memoContent; // Обновляем данные в массиве
        saveToLocalStorage();
        // alert('Заметка сохранена!'); // Временное уведомление
        // Подсветим кнопку зеленым на секунду в знак успеха
        e.target.innerText = '✅ Сохранено!';
        e.target.style.backgroundColor = '#22c55e'; // Зеленый

        setTimeout(() => {
            e.target.innerText = 'Сохранить заметку';
            // Вместо принудительного цвета просто сбрасываем стиль:
            e.target.style.backgroundColor = ''; 
        }, 2000);
    }

    // Если нажата кнопка Редактировать (✎)
    if (e.target.classList.contains('task-list__btn--edit')) {
    const textSpan = parentLi.querySelector('.task-list__text');
    
    textSpan.contentEditable = true;
    textSpan.focus();

    // 1. Обработка клавиш (Enter для сохранения)
    textSpan.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Запрещаем перенос строки
            textSpan.blur(); // Убираем фокус (это само вызовет событие 'blur')
        }
    });

    // 2. Логика сохранения (срабатывает при потере фокуса)
    textSpan.addEventListener('blur', () => {
        textSpan.contentEditable = false;
        const task = tasks.find(t => t.id === id);
        task.text = textSpan.innerText.trim();
        saveToLocalStorage();
        // Мы не вызываем renderTasks(), чтобы не "прыгал" курсор, 
        // данные уже в массиве и в памяти.
    }, { once: true });
}
});