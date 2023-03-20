import { addMark, removeMark, checkForWinner, clearBoardArray, availableSquares } from "./gameBoard.js";

let lockGrid = false;
let lockButtons = false;
let boxMode = false;
let initialized = false;
let offscreen = true;
let startScreen = true;
let options = false;
let background = true;
let backgroundAnimationDelay = 150;
let playerOne;
let playerTwo;
let activePlayer;
const gridSquares = document.querySelectorAll('.gridSquare');
const boardPieces = document.querySelectorAll('.boardPiece');
const setPlayerButtons = document.querySelector('#setPlayerButtons');
const playerOneComputerToggle = document.querySelector('#playerOneComputerToggle');
const playerTwoComputerToggle = document.querySelector('#playerTwoComputerToggle');
const gameOverButtons = document.querySelector('#gameOverButtons');
const startScreenElements = document.querySelectorAll('.startScreen');
const box = document.querySelector('#gameOverBox');
const optionsButtons = document.querySelector('#optionsButtons');
const backgroundDensitySlider = document.querySelector('#backgroundDensity');
const root = document.querySelector(':root');

// Triggered on click of gridSquare elements
function playerClick() {
    // If the square is not empty return with no action
    // Also returns if player input is locked
    if (this.dataset.mark != 'empty' || lockGrid) {
        return;
    }
    
    // Place the current players mark on the grid display
    this.dataset.mark = activePlayer.mark;
    addMark(activePlayer.mark, this.dataset.index);

    // Check for a winner / tie
    let gameState = checkForWinner(this.dataset.index);
    if (gameState) {
        gameOver(gameState);
    } else {
        lockGrid = true;
        setTimeout(changeTurn, 300);
    }

    return true;
}

function computerClick(square) {
    square.dataset.mark = activePlayer.mark;

    square.classList.add('redFlash');
    square.addEventListener('animationend', () => {
        square.classList.remove('redFlash');
    }, { once: true });

    square.dataset.mark = activePlayer.mark;
    addMark(activePlayer.mark, square.dataset.index);

    let gameState = checkForWinner(square.dataset.index);
    if (gameState) {
        gameOver(gameState);
    } else {
        setTimeout(changeTurn, 1500);
    }
}

// Triggered on change turn if activePlayer.computer === true
function computerMove() {
    let bestMove = minMax(activePlayer.mark, 0);
    let bestSquare = document.querySelector(`[data-index="${bestMove.index}"]`);
    computerClick(bestSquare);
}


// minMax algorithm uses recursion to simulate all possible moves
// then picks the best move assuming perfect play from both players
function minMax(mark, depth) {
    let available = availableSquares();
    let maxing = mark === activePlayer.mark ? true : false;
    let mod = maxing ? 1 : -1;
    const bestMove = {
        index: '',
        score: '',
        result: []
    };

    for (let i = 0; i < available.length; i++) {
        addMark(mark, available[i]);
        let result = checkForWinner(available[i]);
        if (result === 'tie') {
            if (bestMove.score === '' || 
            (maxing && bestMove.score < 0) || 
            (!maxing && bestMove.score > 0)) {
                bestMove.index = available[i];
                bestMove.score = 0;
                bestMove.result = result;
            }
        } else if (result) {
            let score = mod * .1 ** depth;
            
            if (bestMove.score === '' ||
                (maxing && score > bestMove.score) ||
                (!maxing && score < bestMove.score)) {
                bestMove.index = available[i];
                bestMove.score = score;
                bestMove.result = result;
            }
        } else {
            let otherMark = mark === 'Cross' ? 'Circle' : 'Cross';
            let bestFound = minMax(otherMark, depth + 1);

            if (bestMove.score === '' ||
            (maxing && bestFound.score > bestMove.score) ||
            (!maxing && bestFound.score < bestMove.score)) {
                bestMove.index = available[i];
                bestMove.score = bestFound.score;
                bestMove.result = bestFound.result;
            }
        }
        removeMark(available[i]);
    }

    return bestMove;
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
        winner = activePlayer;
        let flashColor = activePlayer.computer ? 'redFlash' : 'greenFlash';
        for (let square of gridSquares) {
            if (gameState.includes(parseInt(square.dataset.index))) {
                square.classList.add(flashColor);

                square.addEventListener('animationend', () => {
                    square.classList.remove(flashColor);
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

function checkButtonLock(delay) {
    if (!lockButtons) {
        lockButtons = true;
        setTimeout(() => {
            lockButtons = false;
        }, delay);
        return false;
    } else {
        return true;
    }
}

// Called on game start 
// Attaches event listeners to game elements 
// Initializes the board array
export function initializeGame() {
    playerOne = playerFactory('Player 1', false, 'Cross');
    playerTwo = playerFactory('Player 2', false, 'Circle');

    if (checkButtonLock(1000)) {
        return;
    }

    if (!initialized) {
        gridSquares.forEach((gridSquare) => {
            gridSquare.addEventListener('click', playerClick);
        });
        clearBoardArray();

        initialized = true;
    }

    toggleBoardPosition();
    toggleStartScreen();
    toggleBoard();
    setTimeout(() => {
        toggleBoxBackground(false);
    }, 500);
    setTimeout(() => {
        toggleDisplay(setPlayerButtons);
    }, 1500);
}

// Toggles computer control value of player object
export function toggleComputerControl() {
    if (this.dataset.player === 'One') {
        playerOne.computer = !playerOne.computer;
    } else {
        playerTwo.computer = !playerTwo.computer;
    }
}

export function startGame() {
    toggleBoardPosition();
    toggleBoxBackground(false);
    toggleDisplay(setPlayerButtons);
    setTimeout(changeTurn, 1000);
}

const playerFactory = (playerName, computer, mark) => {
    let score = 0;
    return {playerName, score, computer, mark};
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
    let message;
    if (winner === 'tie') {
        message = "It's a Tie!";
    } else {
        message = winner.playerName + ' wins!';   
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

// Changes active player 
// If new active player is computer controlled triggers a computer move
function changeTurn() {
    lockGrid = true;
    activePlayer = activePlayer === playerOne ? playerTwo : playerOne;

    if (activePlayer.computer) {
        computerMove();
    } else {
        lockGrid = false;
    }
}

// starts a new game from game over screen
export function playAgain() {
    gameOverButtons.classList.add('hidden');
    gameOverButtons.classList.add('invisible');
    toggleBoxBackground();
    toggleBoardPosition();

    setTimeout(changeTurn, 1000);
}

// Returns to start screen from game over screen
export function returnToStart() {
    checkButtonLock(2000);
    toggleBoxBackground();
    toggleBoard();
    playerOneComputerToggle.checked = false;
    playerTwoComputerToggle.checked = false;
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

// Called on page load to set the default background density
export function autoSetBackgroundDensity() {
    if (window.innerWidth < 1000) {
        backgroundDensitySlider.value = -1;
        backgroundAnimationDelay = 550;
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
    if (checkButtonLock(2000)) {
        return;
    }

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
