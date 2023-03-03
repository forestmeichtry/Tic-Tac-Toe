import { addMark, checkForWinner, clearBoardArray } from "./gameBoard.js";

let playerOneTurn = true;
let lockGrid = false;
let boxMode = false;
let initialized = false;
let offscreen = true;
let startScreen = true;
let options = false;
let background = true;
let backgroundAnimationDelay = 150;
const gridSquares = document.querySelectorAll('.gridSquare');
const boardPieces = document.querySelectorAll('.boardPiece');
const gameOverButtons = document.querySelector('#gameOverButtons');
const startScreenElements = document.querySelectorAll('.startScreen');
const box = document.querySelector('#gameOverBox');
const optionsButtons = document.querySelector('#optionsButtons');
const backgroundToggle = document.querySelector('#toggleBackground');
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
        toggleBoxBackground();
        toggleBoardPosition();
    }, 2000);

    setTimeout(() => {
        displayMessage(winner);
    }, 3000);
}

// Called on game start 
// Attaches event listeners to game elements 
// Initializes the board array
export function initializeGame() {
    if (!initialized) {
        gridSquares.forEach((gridSquare) => {
            gridSquare.addEventListener('click', playerClick);
        });
        clearBoardArray();

        initialized = true;
    }

    toggleStartScreen();

    toggleBoard();

    lockGrid = false;
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

        setTimeout(() => {
            toggleDisplay(gameOverButtons);
        }, 1500);
    }, message.length * 150);
}

// Toggles display of passed nodelist
function toggleDisplay(element) {
    if (element.classList.contains('hidden')) {
        element.classList.toggle('hidden');

        setTimeout(() => {
            element.classList.toggle('invisible');
        }, 10);
    } else {
        element.classList.toggle('invisible');

        setTimeout(() => {
            element.classList.toggle('hidden');
        }, 1000);
    }
}

// Simulated typing by adding characters to the box display one by one
// with a random delay between characters
function typeMessage(message) {
    box.textContent = box.textContent + message[0];

    if (message.length > 1) {
        let delay = (Math.random() * 100) + 50;
        setTimeout(() => {
            typeMessage(message.substring(1));
        }, delay);
    }
}

// Toggles board between grid and box position
function toggleBoardPosition() {
    for (let boardPiece of boardPieces) {
        boardPiece.classList.toggle('box');
    }
}

// Toggles game over box
function toggleBoxBackground(cursor=true) {
    if (boxMode) {
        if (cursor) {
            box.classList.toggle('cursor');
        }
        box.textContent = '';
        toggleDisplay(box);
    } else {
        setTimeout(() => {
            if (cursor) {
                box.classList.toggle('cursor');
            }
        }, 1010);
        toggleDisplay(box);
    }

    boxMode = !boxMode;
}

// Toggles board pieces between offscreen / onscreen
// With associated animations
function toggleBoard() {
    if (offscreen) {
        boardPieces.forEach((piece) => {
            piece.classList.toggle('slide-in');
            piece.addEventListener('animationend', () => {
                piece.classList.toggle('offscreen');
                piece.classList.toggle('slide-in');
            }, { once: true });
        });
    } else {
        boardPieces.forEach((piece) => {
            piece.classList.toggle('slide-out');
            piece.addEventListener('animationend', () => {
                piece.classList.toggle('offscreen');
                piece.classList.toggle('slide-out');
                piece.classList.toggle('box');
            }, { once: true });
        });
    }

    offscreen = !offscreen;
}

function changeTurn() {
    playerOneTurn = !playerOneTurn;
}

// starts a new game from game over screen
export function playAgain() {
    gameOverButtons.classList.add('hidden');
    gameOverButtons.classList.add('invisible');
    toggleBoxBackground();
    toggleBoardPosition();

    lockGrid = false;
    changeTurn();
}

// Returns to start screen from game over screen
export function returnToStart() {
    toggleBoxBackground();
    toggleBoard();
    gameOverButtons.classList.add('hidden');
    gameOverButtons.classList.add('invisible');

    setTimeout(() => {
        toggleStartScreen();
    }, 1100);

    lockGrid = true;
}

// Initially called on page load, then calls itself after a delay (backgroundAnimationDelay)
// Creates a div with a randomly assigned x-position and falling animation
export function animateBackground() {
    if (!background) {
        return;
    }

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

// Toggles animated background
export function toggleBackground() {
    let rs = getComputedStyle(root);

    if (background) {
        background = !background;
        let marks = document.querySelectorAll('.fallingMark');
        for (let mark of marks) {
            mark.remove();
        }
    } else {
        background = !background;
        animateBackground();
    }
}

// Changes background density by adjusting delay between animateBackground calls
export function changeBackgroundDensity() {
    let value = this.value
    if (value < 1) {
        backgroundAnimationDelay = 150 - (400 * value);
    } else {
        backgroundAnimationDelay = 100 / value;
    }
}

// Toggles start screen
// with associated fade in / out animation
function toggleStartScreen() {
    if (startScreen) {
        startScreenElements.forEach((element) => {
            element.classList.add('fadeout');
            element.addEventListener('animationend', () => {
                element.classList.remove('fadeout');
                element.classList.toggle('hidden');
            }, { once: true });
        });
    } else {
        startScreenElements.forEach((element) => {
            element.classList.toggle('hidden');
            element.classList.add('fadein');
            setTimeout(() => {
                element.classList.remove('fadein');
            }, 1100);
        });
    }

    startScreen = !startScreen;
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

export function toggleOptions() {
    if (!options) {
        toggleBoardPosition();
        toggleBoard();
        toggleStartScreen();

        setTimeout(() => {
            toggleBoxBackground(false);
        }, 500);

        setTimeout(() => {
            toggleDisplay(optionsButtons);
        }, 1500);
    } else {
        toggleBoxBackground(false);
        toggleBoard();
        optionsButtons.classList.add('hidden');
        optionsButtons.classList.add('invisible');

        setTimeout(() => {
            toggleStartScreen();
        }, 1100);
    }

    options = !options;
}
