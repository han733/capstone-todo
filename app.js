const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const searchInput = document.getElementById('search-input');
const prioritySelect = document.getElementById('priority-select');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#039;'
  }[m]));
}

// render terima parameter taskList
function render(taskList = tasks) {
  list.innerHTML = '';
  taskList.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = t.done ? 'done' : '';
    
    // Tentukan class warna prioritas
    let priorityClass = 'priority-rendah';
    if (t.priority === 'Sedang') priorityClass = 'priority-sedang';
    if (t.priority === 'Tinggi') priorityClass = 'priority-tinggi';

    li.innerHTML = `
      <span class="${priorityClass}">[${t.priority}] ${escapeHtml(t.text)}</span>
      <div class="actions">
        <button class="toggle">${t.done ? '↺' : '✓'}</button>
        <button class="edit">Edit</button>
        <button class="delete">Hapus</button>
      </div>
    `;
    list.appendChild(li);

    // tombol selesai
    li.querySelector('.toggle').addEventListener('click', () => {
      tasks[i].done = !tasks[i].done;
      saveTasks(); render();
    });

    // tombol edit
    li.querySelector('.edit').addEventListener('click', () => {
      const newText = prompt('Ubah tugas:', tasks[i].text);
      if (newText !== null) {
        const v = newText.trim();
        if (v) { tasks[i].text = v; saveTasks(); render(); }
      }
    });

    // tombol hapus
    li.querySelector('.delete').addEventListener('click', () => {
      if (confirm('Hapus tugas ini?')) {
        tasks.splice(i, 1);
        saveTasks(); render();
      }
    });
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  const priority = prioritySelect.value;
  if (!text) return;
  tasks.push({ text, done: false, priority });
  saveTasks();
  render();
  form.reset();
  input.focus();
});

// event listener search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = tasks.filter(t => t.text.toLowerCase().includes(query));
  render(filtered);
});

// initial render
render();


