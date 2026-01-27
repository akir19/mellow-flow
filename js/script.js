// Наш "банк данных"
let tasks = [
    {
        id: Date.now(),
        text: "Создать первое приложение в MellowFlow",
        isCompleted: false,
        memo: "Использовать CSS Grid и Flexbox для верстки",
        date: "2026-01-27"
    }
];

// 1. Находим список в HTML, куда будем добавлять задачи
const taskListElement = document.querySelector('.task-list');

// 2. Функция для отрисовки (рендера) задач на экран
function renderTasks() {
    taskListElement.innerHTML = ''; 

    tasks.forEach((task) => {
        // Создаем элемент списка
        const li = document.createElement('li');
        li.classList.add('task-list__item');

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