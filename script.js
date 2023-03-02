import { animateBackground, initializeGame, toggleLightMode, playAgain, returnToStart } from "./displayController.js";

const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', initializeGame);

const lightModeButton = document.querySelector('#lightMode');
lightModeButton.addEventListener('click', toggleLightMode);

const playAgainButton = document.querySelector('#playAgain');
playAgainButton.addEventListener('click', playAgain);

const mainMenuButton = document.querySelector('#mainMenu');
mainMenuButton.addEventListener('click', returnToStart);

animateBackground();

// TODO: add slider for background density
// Create better light mode toggle