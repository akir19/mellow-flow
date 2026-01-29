let tasks = JSON.parse(localStorage.getItem('mellowTasks')) || [];

function saveToLocalStorage() {
    localStorage.setItem('mellowTasks', JSON.stringify(tasks));
}

const taskListElement = document.querySelector('.task-list');

function renderTasks() {
    taskListElement.innerHTML = ''; 

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.classList.add('task-list__item');
        li.setAttribute('data-id', task.id);

        // Определяем, есть ли текст в мемо для подсветки кнопки
        const hasMemo = task.memo && task.memo.trim() !== '';
        const memoBtnClass = hasMemo ? 'has-content' : '';

        li.innerHTML = `
            <div class="task-list__main">
                <input type="checkbox" class="task-list__checkbox" ${task.isCompleted ? 'checked' : ''}>
                <span class="task-list__text ${task.isCompleted ? 'task-list__text--done' : ''}">
                    ${task.text}
                </span>
                <button class="task-list__btn--memo ${memoBtnClass}">📝</button>
                <button class="task-list__btn--edit">✎</button>
                <button class="task-list__btn--delete">🗑</button>
            </div>
            <div class="task-list__memo">
                <div class="task-list__memo-content" contenteditable="true" placeholder="Добавьте описание...">${task.memo || ''}</div>
                <button class="task-list__memo-save">Сохранить заметку</button>
            </div>
        `;

        taskListElement.appendChild(li);
    });
}

renderTasks();

const inputField = document.querySelector('.todo-input__field');
const addBtn = document.querySelector('.todo-input__add-btn');

function addTask() {
    const text = inputField.value.trim();
    if (text !== '') {
        const newTask = {
            id: Date.now(),
            text: text,
            isCompleted: false,
            memo: '',
            date: new Date().toISOString().split('T')[0]
        };
        tasks.push(newTask);
        saveToLocalStorage();
        inputField.value = '';
        renderTasks();
    }
}

addBtn.addEventListener('click', addTask);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

taskListElement.addEventListener('click', (e) => {
    const parentLi = e.target.closest('.task-list__item');
    if (!parentLi) return;
    
    const id = Number(parentLi.getAttribute('data-id'));
    const task = tasks.find(t => t.id === id);

    // Удаление
    if (e.target.classList.contains('task-list__btn--delete')) {
        tasks = tasks.filter(t => t.id !== id);
        saveToLocalStorage();
        renderTasks();
    }

    // Чекбокс
    if (e.target.classList.contains('task-list__checkbox')) {
        task.isCompleted = !task.isCompleted;
        saveToLocalStorage();
        renderTasks();
    }

    // Открытие/Закрытие Мемо
    if (e.target.classList.contains('task-list__btn--memo')) {
        const memoBlock = parentLi.querySelector('.task-list__memo');
        memoBlock.classList.toggle('task-list__memo--active');
    }

    // Сохранение Мемо
    if (e.target.classList.contains('task-list__memo-save')) {
        const memoContent = parentLi.querySelector('.task-list__memo-content').innerText;
        task.memo = memoContent;
        saveToLocalStorage();
        
        // Визуальный отклик
        e.target.innerText = '✅ Сохранено!';
        e.target.style.backgroundColor = '#22c55e';
        
        // Обновляем подсветку иконки 📝 без полной перерисовки
        const memoIconBtn = parentLi.querySelector('.task-list__btn--memo');
        if (task.memo.trim() !== '') {
            memoIconBtn.classList.add('has-content');
        } else {
            memoIconBtn.classList.remove('has-content');
        }

        setTimeout(() => {
            e.target.innerText = 'Сохранить заметку';
            e.target.style.backgroundColor = ''; 
        }, 2000);
    }

    // Редактирование текста задачи
    if (e.target.classList.contains('task-list__btn--edit')) {
        const textSpan = parentLi.querySelector('.task-list__text');
        textSpan.contentEditable = true;
        textSpan.focus();

        textSpan.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                textSpan.blur();
            }
        });

        textSpan.addEventListener('blur', () => {
            textSpan.contentEditable = false;
            task.text = textSpan.innerText.trim();
            saveToLocalStorage();
        }, { once: true });
    }
});

// Тема
const themeBtn = document.querySelector('.todo-app__theme-btn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeBtn.innerText = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
});

if (localStorage.getItem('darkTheme') === 'true') {
    document.body.classList.add('dark-theme');
    themeBtn.innerText = '☀️';
}

// Меню
const menuBtn = document.querySelector('.todo-app__menu-btn');
const sideMenu = document.querySelector('.side-menu');
const closeMenuBtn = document.querySelector('.side-menu__close');

menuBtn.addEventListener('click', () => sideMenu.classList.remove('side-menu--hidden'));
closeMenuBtn.addEventListener('click', () => sideMenu.classList.add('side-menu--hidden'));

document.querySelector('#clear-all').addEventListener('click', () => {
    if (confirm('Удалить все задачи?')) {
        tasks = [];
        saveToLocalStorage();
        renderTasks();
        sideMenu.classList.add('side-menu--hidden');
    }
});

document.querySelector('#sort-tasks').addEventListener('click', () => {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    saveToLocalStorage();
    renderTasks();
    sideMenu.classList.add('side-menu--hidden');
});

const aboutModal = document.querySelector('#about-modal');
document.querySelector('#about-app').addEventListener('click', () => aboutModal.classList.remove('modal--hidden'));
document.querySelector('.modal__close').addEventListener('click', () => {
    aboutModal.classList.add('modal--hidden');
    sideMenu.classList.add('side-menu--hidden');
});