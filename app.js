const board = document.getElementById('board');
const createBtn = document.getElementById('createNote');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.getElementById('modal-close');

let scale = 1;
let notes = JSON.parse(localStorage.getItem('notes') || '[]');

const pastelColors = ['#FFEBEE', '#FFF3E0', '#E8F5E9', '#E3F2FD', '#F3E5F5'];

function createNote(title, description, x = 100, y = 100, color = null) {
  const note = document.createElement('div');
  note.className = 'note';
  note.textContent = title;
  note.style.background = color || pastelColors[Math.floor(Math.random() * pastelColors.length)];
  note.style.left = `${x}px`;
  note.style.top = `${y}px`;

  const noteData = { title, description, x, y, color: note.style.background };

  note.onclick = (e) => {
    e.stopPropagation();
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modal.classList.remove('hidden');
  };

  let isDragging = false;
  let offsetX, offsetY;

  note.onmousedown = (e) => {
    isDragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    note.style.zIndex = 1000;
  };

  board.onmousemove = (e) => {
    if (isDragging) {
      note.style.left = `${e.pageX - offsetX}px`;
      note.style.top = `${e.pageY - offsetY}px`;
    }
  };

  board.onmouseup = () => {
    if (isDragging) {
      isDragging = false;
      note.style.zIndex = 1;
      noteData.x = parseInt(note.style.left);
      noteData.y = parseInt(note.style.top);
      updateNotes();
    }
  };

  board.appendChild(note);
  notes.push(noteData);
  updateNotes();
}

function updateNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

createBtn.onclick = () => {
  const title = prompt('Titre du post-it ?');
  if (!title) return;
  const description = prompt('Description ?');
  if (description === null) return;
  createNote(title, description, 150, 150);
};

closeModal.onclick = () => {
  modal.classList.add('hidden');
};

board.onwheel = (e) => {
  e.preventDefault();
  scale += e.deltaY * -0.001;
  scale = Math.min(Math.max(0.5, scale), 2);
  board.style.transform = `scale(${scale})`;
};

window.onload = () => {
  notes.forEach(n => createNote(n.title, n.description, n.x, n.y, n.color));
};
