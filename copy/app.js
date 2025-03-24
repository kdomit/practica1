const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Función para cargar tareas desde el archivo JSON
function loadTasks() {
    try {
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return []; // Si no existe el archivo, retorna un array vacío
    }
}

// Función para guardar tareas en el archivo JSON
function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

let tasks = loadTasks();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para renderizar la vista principal con EJS
app.get('/', (req, res) => {
    res.render('index', { tasks });
});

// Ruta para agregar una tarea
app.post('/add', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.send("¡Por favor completa todos los campos!");
    }

    if (tasks.some(task => task.title === title)) {
        res.send("¡La tarea ya existe!");

    }

    tasks.push({ title, description, completed: false });
    saveTasks(tasks);
    res.redirect('/');
});

// Ruta para eliminar una tarea
app.post('/delete', (req, res) => {
    const { title } = req.body;
    tasks = tasks.filter(task => task.title !== title);
    saveTasks(tasks);
    res.redirect('/');
});

// Ruta para marcar/desmarcar una tarea como completada
app.post('/toggle', (req, res) => {
    const { title } = req.body;
    tasks = tasks.map(task => {
        if (task.title === title) {
            task.completed = !task.completed;
        }
        return task;
    });
    saveTasks(tasks);
    res.redirect('/');
});

module.exports = app;
