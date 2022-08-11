/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const WIDTH = 7;
const HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  //aded this to reset the board onclick
  if (board.length) {
    board = [];
  }
  for (let i = 0; i < HEIGHT; i++) {
    board.push(Array(WIDTH).fill(null));
  }
}
/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  //aded this to reset the board onclick
  htmlBoard.innerText = "";
  // TODO: add comment for this code
  // creates a new table row set to the variable "top", then sets the id to "column-top" and adds an even listener for clicks
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // added event listeners for mouse hovering over the top row
  top.addEventListener("mouseover", onMouseOver);
  top.addEventListener("mouseout", onMouseOut);
  // creates td elements for the top row, sets the id to the index, and appends to the top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);
  // TODO: add comment for this code
  // a nested for loop that creates rows in the top loop, and tds in the inner loop to fill the rows.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    //added classes to the each row to be able to add a pseudo gradient look to my board
    row.classList.add(`row${y}`)
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      // added an aditional div to help with styling the board to look like the classic game
        let roundDiv = document.createElement('div')
        roundDiv.classList.add('roundDiv')
        cell.append(roundDiv)
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}
//creates a new piece with the color of the current player in the top row for the corresponding column.
function onMouseOver(e) {
  let newPiece = document.createElement("div");
  newPiece.classList.add("piece", `player${currPlayer}`);
  e.target.append(newPiece);
}
//removes the piece from the top row if user moves mouse away from it
function onMouseOut(e) {
  e.target.firstChild.remove();
}
/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = board.length - 1; i > -1; i--) {
    if (board[i][x] === null) {
      return i;
    }
  }
  return null;
}
/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let td = document.getElementById(`${y}-${x}`);
  let newDiv = document.createElement("div");
  newDiv.classList.add("piece", `player${currPlayer}`, "drop");
  td.append(newDiv);
}
/** endGame: announce game end */
function endGame(msg) {
  // remove the event listener so user can't click on top row if game is over.
  let top = document.getElementById("column-top");
  top.removeEventListener("click", handleClick);
  // TODO: pop up alert message
  setTimeout(() => {
    alert(msg);
  }, 600);
}
/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  // board[]
  board[y][x] = currPlayer;
  placeInTable(y, x);
  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  // only top row needs to be checked, if all values in top row !== null, passes tie message to endGame func
  if (board[0].every((cell) => cell)) {
    endGame("It's a tie!");
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
  // removes the previous player's piece and appends a new one for the next player
  evt.target.firstChild.remove();
  let newPiece = document.createElement("div");
  newPiece.classList.add("piece", `player${currPlayer}`);
  evt.target.append(newPiece);
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    if (
      cells.every(
        // modified to pass on winning cells to winAnimation function
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      )
    ) {
      winAnimation(cells);
      return true;
    }
  }
  // TODO: read and understand this code. Add comments to help you.
  // nested for loops that iterates through all possible horizontal, vertical and diagonal 4 cell possibilities.
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      // if any of the possible matches returns true when checked by _win func, this nested loop will return true.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
//adds spin class to pieces in winning cells to display spinning animation
function winAnimation(cells) {
  setTimeout(() => {
  for (let cell of cells) {
    document
      .getElementById(`${cell[0]}-${cell[1]}`).firstChild.nextElementSibling.classList.add("spin");
  }
}, 550)
}
//aded this func to reset the board onclick.
function reset() {
  makeBoard();
  makeHtmlBoard();
}
// event listener for reset button. removes spin class and adds reset class for falling pieces animation. it then calls reset function
let resetBtn = document.getElementById("reset")
resetBtn.addEventListener('click', () => {
  let pieces = document.querySelectorAll(".piece")
  for (let piece of pieces){
    if (piece.classList.contains("spin")){
      piece.classList.remove("spin")
    }
    piece.classList.add('reset')
  }
  setTimeout(() => {
    reset();
  }, 600);
})
reset();
