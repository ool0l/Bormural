const board = document.getElementById("board");
const modal = document.getElementById("modal");
const viewModal = document.getElementById("view-modal");
const createBtn = document.getElementById("create-note");
const cancelBtn = document.getElementById("cancel");
const closeViewBtn = document.getElementById("close-view");

let scale = 1;
let offsetX = 0;
let offsetY = 0;

let dragging = false;
let dragNote = null;
let startX = 0;
let startY = 0;

const colors = ["#FFEBEE", "#E8F5E9", "#E3F2FD", "#FFF3E0", "#FCE4EC", "#E0F7FA", "#F3E5F5"];

function saveNotes() {
  const data = [];
  board.querySelectorAll('.note').forEach(note => {
    data.push({
      title: note.dataset.title,
      description: note.dataset.description,
      x: note.offsetLeft,
      y: note.offsetTop,
      color: note.style.backgroundColor
    });
  });
  localStorage.setItem("ideoboard_notes", JSON.stringify(data));
}

function loadNotes() {
  const data = JSON.parse(localStorage.getItem("ideoboard_notes") || "[]");
  data.forEach(n => {
    createNote(n.title, n.description, n.x, n.y, n.color);
  });
}

function createNote(title, description, x, y, color = null) {
  const note = document.createElement("div");
  note.className = "note";
  note.textContent = title;
  note.dataset.title = title;
  note.dataset.description = description;
  note.style.left = `${x}px`;
  note.style.top = `${y}px`;
  note.style.backgroundColor = color || colors[Math.floor(Math.random() * colors.length)];

  note.addEventListener("mousedown", (e) => {
    dragging = true;
    dragNote = note;
    startX = e.clientX - note.offsetLeft;
    startY = e.clientY - note.offsetTop;
  });

  note.addEventListener("click", (e) => {
    if (dragging) return;
    e.stopPropagation();
    document.getElementById("view-title").textContent = note.dataset.title;
    document.getElementById("view-description").textContent = note.dataset.description;
    viewModal.classList.remove("hidden");
  });

  board.appendChild(note);
  saveNotes();
}

board.addEventListener("mousemove", (e) => {
  if (dragging && dragNote) {
    dragNote.style.left = `${e.clientX - startX}px`;
    dragNote.style.top = `${e.clientY - startY}px`;
  }
});

board.addEventListener("mouseup", () => {
  dragging = false;
  dragNote = null;
  saveNotes();
});

board.addEventListener("dblclick", (e) => {
  modal.classList.remove("hidden");
  modal.dataset.x = e.clientX;
  modal.dataset.y = e.clientY;
});

createBtn.addEventListener("click", () => {
  const title = document.getElementById("note-title").value.trim();
  const description = document.getElementById("note-description").value.trim();
  if (title) {
    createNote(title, description, modal.dataset.x, modal.dataset.y);
    document.getElementById("note-title").value = "";
    document.getElementById("note-description").value = "";
    modal.classList.add("hidden");
  }
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

closeViewBtn.addEventListener("click", () => {
  viewModal.classList.add("hidden");
});

board.addEventListener("wheel", (e) => {
  e.preventDefault();
  const zoomAmount = 0.1;
  scale += e.deltaY > 0 ? -zoomAmount : zoomAmount;
  scale = Math.max(0.5, Math.min(2.5, scale));
  board.style.transform = `scale(${scale})`;
});

loadNotes();
