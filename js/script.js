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