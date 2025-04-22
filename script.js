const words = ["HTML", "CSS", "JAVASCRIPT", "PYTHON", "REACT", "ANGULAR", "NODE", "VUE", "MYSQL", "API"];
const gridSize = 12;

let grid = [];
let selectedCells = [];
let foundWords = [];

document.addEventListener("DOMContentLoaded", () => {
  generateGrid();
});

function generateGrid() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  placeWords();
  fillRandomLetters();
  renderGrid();
  displayWords();
}

function placeWords() {
  words.forEach(word => {
    let placed = false;
    while (!placed) {
      let dir = Math.random() < 0.5 ? "H" : "V";
      let row = Math.floor(Math.random() * gridSize);
      let col = Math.floor(Math.random() * gridSize);

      if (canPlace(word, row, col, dir)) {
        for (let i = 0; i < word.length; i++) {
          if (dir === "H") grid[row][col + i] = word[i];
          else grid[row + i][col] = word[i];
        }
        placed = true;
      }
    }
  });
}

function canPlace(word, row, col, dir) {
  if (dir === "H" && col + word.length > gridSize) return false;
  if (dir === "V" && row + word.length > gridSize) return false;

  for (let i = 0; i < word.length; i++) {
    let cell = dir === "H" ? grid[row][col + i] : grid[row + i][col];
    if (cell !== '' && cell !== word[i]) return false;
  }
  return true;
}

function fillRandomLetters() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function renderGrid() {
  const gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = '';

  grid.forEach((row, r) => {
    row.forEach((letter, c) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = letter;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener("click", () => handleCellClick(cell));
      gridContainer.appendChild(cell);
    });
  });
}

function handleCellClick(cell) {
  if (cell.classList.contains("found")) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  selectedCells.push({ row, col, letter: grid[row][col], element: cell });

  cell.classList.add("selected");

  const currentWord = selectedCells.map(c => c.letter).join("");

  if (words.includes(currentWord) && !foundWords.includes(currentWord)) {
    selectedCells.forEach(c => {
      c.element.classList.remove("selected");
      c.element.classList.add("found");
    });
    foundWords.push(currentWord);
    updateWordList();
    showMessage(`¡Encontraste "${currentWord}"!`);
    selectedCells = [];
  } else if (!words.some(word => word.startsWith(currentWord))) {
    selectedCells.forEach(c => c.element.classList.remove("selected"));
    selectedCells = [];
  }
}

function displayWords() {
  const list = document.getElementById("word-list");
  list.innerHTML = 'Busca: ' + words.map(word => {
    const found = foundWords.includes(word);
    return `<span class="${found ? 'found-word' : ''}">${word}</span>`;
  }).join(", ");
}

function updateWordList() {
  displayWords();
}

function showMessage(msg) {
  const messageBox = document.getElementById("message");
  messageBox.textContent = msg;
  setTimeout(() => {
    messageBox.textContent = '';
  }, 3000);
}

