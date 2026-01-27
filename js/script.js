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
                ${task.memo}
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
});