import { addMark, checkForWinner, clearBoardArray } from "./gameBoard.js";

let playerOneTurn = true;
let backgroundAnimationDelay = 150;
const gridSquares = document.querySelectorAll('.gridSquare');
const boardPieces = document.querySelectorAll('.boardPiece');
const startScreenElements = document.querySelectorAll('.startScreen');
const root = document.querySelector(':root');

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

// Called on game start 
// Attaches event listeners to game elements 
// Initializes the board array
export function initializeGame() {
    startScreenElements.forEach((element) => {
        element.classList.add('fadeout');
        element.addEventListener('animationend', () => {
            element.style.display = 'none';
        });
    });

    gridSquares.forEach((gridSquare) => {
        gridSquare.addEventListener('click', playerClick);
    });

    boardPieces.forEach((piece) => {
        piece.classList.add('slide-in');
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

// Initially called on page load, then calls itself after a delay (backgroundAnimationDelay)
// Creates a div with a randomly assigned x-position and falling animation
export function animateBackground() {
    let element = document.createElement('div');
    element.classList.add('fallingMark');

    if (Math.random() > .5) {
        element.dataset.mark = 'Circle';
    } else {
        element.dataset.mark = 'Cross';
    }

    element.style.animationName = 'falling' + (Math.floor(Math.random() * 4));
    element.style.left = (Math.random() * window.visualViewport.width) + 'px';
    element.style.animationDuration = (Math.floor(Math.random() * 6) + 6) + 's';

    // An event listener is attached to delete the element when it reaches the bottom of the screen
    element.addEventListener('animationend', () => {
        element.remove();
    });

    document.body.appendChild(element);

    setTimeout(animateBackground, backgroundAnimationDelay);
}

// Toggles light mode by swapping primary and secondary color variables in root
export function toggleLightMode() {
    let rs = getComputedStyle(root);
    let temp = rs.getPropertyValue('--primaryColor');
    root.style.setProperty('--primaryColor', rs.getPropertyValue('--secondaryColor'));
    root.style.setProperty('--secondaryColor', temp);
}
