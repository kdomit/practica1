document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('formTask').addEventListener('submit', saveTask);

    function saveTask(e) {
        e.preventDefault();

        let title = document.getElementById('title').value.trim();
        let description = document.getElementById('description').value.trim();

        if (!title || !description) {
            alert('Por favor completa todos los campos');
            return;
        }

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Validar si la tarea ya existe
        if (tasks.some(task => task.title === title)) {
            alert('La tarea ya existe');
            return;
        }

        let task = {
            title,
            description,
            completed: false // Nueva propiedad para tareas completadas
        };

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        document.getElementById('formTask').reset();
        getTasks();
    }

    window.deleteTask = function (title) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.title !== title);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        getTasks();
    };

    window.toggleTask = function (title) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => {
            if (task.title === title) {
                task.completed = !task.completed;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        getTasks();
    };

    function getTasks(showCompleted = false) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let tasksView = document.getElementById('tasks');
        tasksView.innerHTML = '';

        if (showCompleted) {
            tasks = tasks.filter(task => task.completed);
        }

        if (tasks.length === 0) {
            tasksView.innerHTML = '<div class="alert alert-info">No hay tareas disponibles</div>';
            return;
        }

        tasks.forEach(task => {
            let taskElement = document.createElement('div');
            taskElement.className = 'card mb-3';
            taskElement.innerHTML = `
                <div class="card-body">
                    <input type="checkbox" onclick="toggleTask('${task.title}')" ${task.completed ? 'checked' : ''}>
                    <strong>${task.title}</strong> - ${task.description}
                    <button onclick="deleteTask('${task.title}')" class="btn btn-danger btn-sm ml-3">Eliminar</button>
                </div>
            `;
            tasksView.appendChild(taskElement);
        });
    }

    // Mostrar solo tareas completadas cuando se presione un botón
    document.getElementById('showCompleted').addEventListener('click', function () {
        getTasks(true);
    });

    getTasks();
});
