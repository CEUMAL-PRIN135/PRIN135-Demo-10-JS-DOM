/* Data */
let todos = [
    { "id": "1", "text": "Task 1", "hours": 1, "completed": true },
    { "id": "2", "text": "Task 2", "hours": 2, "completed": false }
];

let currentFilter = "all";

/* DOM Elements */
const list = document.getElementById("todo-list");

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const hoursInput = document.getElementById("hours-input");

const countEl = document.getElementById("todo-count");

const filterButtons = document.querySelectorAll(".filter");

const toggleAllBtn = document.getElementById("toggle-all");

/* Functions */
function getDifficulty(hours) {
    if (hours > 5) return "Hard";
    if (hours > 2) return "Medium";
    return "Easy";
}

function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "×";

    li.append(checkbox, text);

    const hours = typeof todo.hours === "number" ? todo.hours : 0;
    const difficulty = getDifficulty(hours);
    const label = document.createElement("span");
    label.className = `difficulty difficulty-${difficulty.toLowerCase()}`;
    label.textContent = `${difficulty} · ${hours}h`;
    li.append(label);

    li.append(del);
    return li;
}

function render() {
    const items = visibleTodos();
    list.replaceChildren(...items.map(createTodoElement));

    const remaining = todos.filter((t) => !t.completed).length;
    const hoursLeft = totalHoursLeft();
    countEl.textContent =
        `${remaining} item${remaining === 1 ? "" : "s"} left | ` +
        `${hoursLeft} hour${hoursLeft === 1 ? "" : "s"} remaining`;

    filterButtons.forEach((btn) => {
        const active = btn.dataset.filter === currentFilter;
        btn.classList.toggle("active", active);
    });

    toggleAllBtn.hidden = todos.length === 0;
    toggleAllBtn.textContent = todos.length > 0 && todos.every((t) => t.completed) ? "Mark all active" : "Mark all done";
}

function addTodo(text, hours) {
    todos.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        text,
        hours,
        completed: false,
    });

    render();
}

function parseHours(value) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    render();
}

function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) todo.completed = !todo.completed;
    render();
}

function totalHoursLeft() {
    let total = 0;
    for (const todo of todos) {
        if (!todo.completed && typeof todo.hours === "number") {
            total += todo.hours;
        }
    }
    return total;
}

function visibleTodos() {
    if (currentFilter === "active") return todos.filter((t) => !t.completed);
    if (currentFilter === "completed") return todos.filter((t) => t.completed);
    return todos;
}

function toggleAll() {
    const allDone = todos.length > 0 && todos.every((t) => t.completed);
    todos.forEach((t) => (t.completed = !allDone));
    render();
}

/* Event Listeners */
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    const hours = parseHours(hoursInput.value);
    if (!text) return;
    addTodo(text, hours);
    input.value = "";
    hoursInput.value = "";
    input.focus();
});

list.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
        deleteTodo(e.target.closest(".todo-item").dataset.id);
    }
});

list.addEventListener("change", (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
        toggleTodo(e.target.closest(".todo-item").dataset.id);
    }
});

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        render();
    });
});

toggleAllBtn.addEventListener("click", toggleAll);

render();