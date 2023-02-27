import { addMark, checkForWinner, clearBoardArray } from "./gameBoard.js";

let playerOneTurn = true;
let backgroundAnimationDelay = 100;
const gridSquares = document.querySelectorAll('.gridSquare');
const boardPieces = document.querySelectorAll('.boardPiece');

// Triggered on click of gridSquare elements
function playerClick() {
    // If the square is not empty return with no action
    if (this.dataset.mark != 'empty') {
        return;
    }

    // Place the current players mark
    let mark = playerOneTurn ? 'Cross' : 'Circle';
    this.dataset.mark = mark;
    addMark(mark, this.dataset.index);

    // Check for a winner / tie
    let gameState = checkForWinner(this.dataset.index);
    if (gameState) {
        gameOver(gameState);
    } else {
        changeTurn();
    }
}

// Triggered on win / tie
// Announce the game result in console and clears the board
function gameOver(gameState) {
    if (gameState === 'win') {
        let winner = playerOneTurn ? 'Player 1' : 'Player 2';
        console.log(winner + ' wins!');
    } else {
        console.log('Tie game!');
    }

    clearBoardArray();
    clearDisplay();
}

// Called once on page load, attaches event listeners to each square
// and initializes the board array
export function initializeGame() {
    gridSquares.forEach((gridSquare) => {
        gridSquare.addEventListener('click', playerClick);
    });

    boardPieces.forEach((piece) => {
        piece.classList.add('animation');
    });
    clearBoardArray();
}

function clearDisplay() {
    gridSquares.forEach((gridSquare) => {
        gridSquare.dataset.mark = 'empty';
    });
}

function changeTurn() {
    playerOneTurn = !playerOneTurn;
}

export function animateBackground() {
    let element = document.createElement('div');
    element.classList.add('fallingMark');

    if (Math.random() > .5) {
        element.dataset.mark = 'Circle';
    } else {
        element.dataset.mark = 'Cross';
    }

    element.style.animationName = 'falling' + (Math.floor(Math.random() * 4));
    element.style.left = (Math.random() * window.innerWidth) + 'px';
    element.style.animationDuration = (Math.floor(Math.random() * 6) + 6) + 's';

    element.addEventListener('animationend', () => {
        element.remove();
    });

    document.body.appendChild(element);

    setTimeout(animateBackground, backgroundAnimationDelay);
}
