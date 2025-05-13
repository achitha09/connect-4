let redScore = 0;
let yellowScore = 0;

const board = document.getElementById("board");
const message = document.getElementById("message");

const ROWS = 6;
const COLS = 7;
const gameBoard = [];
let currentPlayer = "red";  // Red goes first

// Create board UI and initialize data
for (let row = 0; row < ROWS; row++) {
  gameBoard[row] = [];
  for (let col = 0; col < COLS; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    board.appendChild(cell);
    gameBoard[row][col] = null;
  }
}

board.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell") || currentPlayer !== "red") return;  // Prevent clicking when it's not Player 1's turn

  const col = +e.target.dataset.col;
  playerMove(col);  // Make the player's move
});

function playerMove(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!gameBoard[row][col]) {
      gameBoard[row][col] = "red";
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.classList.add("red");

      if (checkWinner(row, col)) {
        redScore++;
        document.getElementById("score-red").textContent = `You (Red): ${redScore}`;
        message.textContent = "You Win! 🎉";
        board.style.pointerEvents = "none";  // Disable further moves after win
        return;
      }

      currentPlayer = "yellow";  // Switch to bot's turn
      message.textContent = "Chatai Bot's Turn (Yellow)";
      setTimeout(botMove, 500);  // Add delay for bot's turn
      return;
    }
  }
}

function botMove() {
  const winningMove = findWinningMove("yellow");  // Check if bot can win
  const blockMove = findWinningMove("red");  // Check if player can win and block it

  let colToPlay;
  if (winningMove) {
    colToPlay = winningMove;
  } else if (blockMove) {
    colToPlay = blockMove;
  } else {
    const validCols = [];
    for (let col = 0; col < COLS; col++) {
      if (!gameBoard[0][col]) validCols.push(col);  // Get valid columns
    }

    if (validCols.length === 0) {
      message.textContent = "It's a tie!";
      return;
    }

    colToPlay = validCols[Math.floor(Math.random() * validCols.length)];  // Bot picks a random valid column
  }

  // Make the move
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!gameBoard[row][colToPlay]) {
      gameBoard[row][colToPlay] = "yellow";
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${colToPlay}"]`);
      cell.classList.add("yellow");

      if (checkWinner(row, colToPlay)) {
        yellowScore++;
        document.getElementById("score-yellow").textContent = `Chatai Bot (Yellow): ${yellowScore}`;
        message.textContent = "Chatai Bot Wins! 🤖";
        board.style.pointerEvents = "none";  // Disable further moves after bot win
        return;
      }

      currentPlayer = "red";  // Switch to Player 1's turn
      message.textContent = "Your Turn (Red)";
      return;
    }
  }
}

// Function to check if a player can win by placing a token in a column
function findWinningMove(player) {
  for (let col = 0; col < COLS; col++) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!gameBoard[row][col]) {
        gameBoard[row][col] = player;
        if (checkWinner(row, col)) {
          gameBoard[row][col] = null;  // Reset the cell after check
          return col;
        }
        gameBoard[row][col] = null;  // Reset the cell after check
        break;
      }
    }
  }
  return null;
}

function checkWinner(row, col) {
  return (
    checkDirection(row, col, 0, 1) ||  // horizontal
    checkDirection(row, col, 1, 0) ||  // vertical
    checkDirection(row, col, 1, 1) ||  // diagonal down-right
    checkDirection(row, col, 1, -1)    // diagonal down-left
  );
}

function checkDirection(row, col, rowDir, colDir) {
  const color = gameBoard[row][col];
  let count = 1;

  // Check in one direction
  for (let i = 1; i < 4; i++) {
    const r = row + rowDir * i;
    const c = col + colDir * i;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || gameBoard[r][c] !== color) break;
    count++;
  }

  // Check in the opposite direction
  for (let i = 1; i < 4; i++) {
    const r = row - rowDir * i;
    const c = col - colDir * i;
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || gameBoard[r][c] !== color) break;
    count++;
  }

  return count >= 4;
}

document.getElementById("reset").addEventListener("click", resetGame);

function resetGame() {
  // Clear the game board UI and data
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      gameBoard[row][col] = null;
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.classList.remove("red", "yellow");
    }
  }

  currentPlayer = "red";  // Reset to Player 1's turn
  message.textContent = "Your Turn (Red)";
  board.style.pointerEvents = "auto";  // Enable board for playing
}
