import { addMark, checkForWinner, clearBoardArray } from "./gameBoard.js";

let playerOneTurn = true;
let lockGrid = false;
let backgroundAnimationDelay = 150;
let boxMode = false;
const gridSquares = document.querySelectorAll('.gridSquare');
const boardPieces = document.querySelectorAll('.boardPiece');
const startScreenElements = document.querySelectorAll('.startScreen');
const box = document.querySelector('.boxWrapper');
const root = document.querySelector(':root');

// Triggered on click of gridSquare elements
function playerClick() {
    // If the square is not empty return with no action
    // Also returns if player input is locked
    if (this.dataset.mark != 'empty' || lockGrid) {
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
    lockGrid = true;
    let winner;
    if (gameState === 'tie') {
        winner = 'tie';
        for (let boardPiece of boardPieces) {
            boardPiece.classList.add('redFlash');

            boardPiece.addEventListener('animationend', () => {
                boardPiece.classList.remove('redFlash');
            }, { once: true });
        }
    } else {
        winner = playerOneTurn ? 'Player 1' : 'Player 2';
        for (let square of gridSquares) {
            if (gameState.includes(parseInt(square.dataset.index))) {
                square.classList.add('greenFlash');

                square.addEventListener('animationend', () => {
                    square.classList.remove('greenFlash');
                }, { once: true });
            }
        }
    }

    setTimeout(() => {
        clearBoardArray();
        clearDisplay();
    }, 1500);

    setTimeout(() => {
        toggleBoxMode();
    }, 2000);

    setTimeout(() => {
        displayMessage(winner);
    }, 3000);
}

// Called on game start 
// Attaches event listeners to game elements 
// Initializes the board array
export function initializeGame() {
    startScreenElements.forEach((element) => {
        element.classList.add('fadeout');
        element.addEventListener('animationend', () => {
            element.classList.remove('fadeout');
            element.style.display = 'none';
        }, { once: true });
    });

    gridSquares.forEach((gridSquare) => {
        gridSquare.addEventListener('click', playerClick);
    });

    boardPieces.forEach((piece) => {
        piece.classList.add('slide-in');
        piece.addEventListener('animationend', () => {
            piece.classList.remove('offscreen');
            piece.classList.remove('slide-in');
        }, { once: true });
    });
    clearBoardArray();
}

function clearDisplay() {
    gridSquares.forEach((gridSquare) => {
        gridSquare.classList.add('fadeout');
        gridSquare.addEventListener('animationend', () => {
            gridSquare.classList.remove('fadeout');
            gridSquare.dataset.mark = 'empty';
        }, { once: true });
    });
}

function displayMessage(winner) {
    let playAgain = 'Play again?'
    let message;
    if (winner === 'tie') {
        message = "It's a Tie!";
    } else {
        message = winner + ' wins!';
        
    }
    
    typeMessage(message);
    setTimeout(() => {
        box.textContent = box.textContent + '\r\n\r\n';
        typeMessage('Play again?');
    }, message.length * 150);
}

function typeMessage(message) {
    box.textContent = box.textContent + message[0];

    if (message.length > 1) {
        let delay = (Math.random() * 100) + 50;
        setTimeout(() => {
            typeMessage(message.substring(1));
        }, delay);
    }
}

// TODO: Message display, user :after to place a cursor
// then add message gradually
function toggleBoxMode() {
    for (let boardPiece of boardPieces) {
        boardPiece.classList.toggle('box');
    }


    if (boxMode) {
        box.classList.toggle('invisible');
        setTimeout(() => {
            box.classList.toggle('hidden');
        }, 1000);
    } else {
        box.classList.toggle('hidden');
        setTimeout(() => {
            box.classList.toggle('invisible');
        }, 10);
        setTimeout(() => {
            box.classList.toggle('cursor');
        }, 1010);
    }

    boxMode = !boxMode;
}

// FOR TESTING
const boxButton = document.querySelector('#boxMode');
boxButton.addEventListener('click', toggleBoxMode);

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
    }, { once: true });

    document.body.appendChild(element);

    setTimeout(animateBackground, backgroundAnimationDelay);
}

// Toggles light mode by swapping primary and secondary color variables in root
export function toggleLightMode() {
    box.style.transition = 'none';
    for (let boardPiece of boardPieces) {
        boardPiece.style.transition = 'none';
    }

    let rs = getComputedStyle(root);

    let tempColor = rs.getPropertyValue('--primaryColor');
    root.style.setProperty('--primaryColor', rs.getPropertyValue('--secondaryColor'));
    root.style.setProperty('--secondaryColor', tempColor);

    let tempRGB = rs.getPropertyValue('--primaryRGB');
    root.style.setProperty('--primaryRGB', rs.getPropertyValue('--secondaryRGB'));
    root.style.setProperty('--secondaryRGB', tempRGB);

    setTimeout(() => {
        box.style.transition = '1s';
        for (let boardPiece of boardPieces) {
            boardPiece.style.transition = '1s';
        }
    }, 10);
}
