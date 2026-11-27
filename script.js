/* Data */
let todos = [
	{ "id": "1", "text": "Task 1", "hours": 1, "completed": true },
	{ "id": "2", "text": "Task 2", "hours": 2, "completed": false }
];

/* DOM Elements */
const list = document.getElementById("todo-list");

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
  const items = todos;
  list.replaceChildren(...items.map(createTodoElement));
}

render();