import { animateBackground, initializeGame, toggleLightMode, playAgain, returnToStart, toggleOptions } from "./displayController.js";

const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', initializeGame);

const playAgainButton = document.querySelector('#playAgain');
playAgainButton.addEventListener('click', playAgain);

const mainMenuButton = document.querySelector('#mainMenu');
mainMenuButton.addEventListener('click', returnToStart);

const optionsButton = document.querySelector('#optionsButton');
optionsButton.addEventListener('click', toggleOptions);

const lightMode = document.querySelector('#lightMode');
lightMode.addEventListener('click', toggleLightMode);

const closeOptionsButton = document.querySelector('#closeOptions');
closeOptionsButton.addEventListener('click', toggleOptions);

animateBackground();

// TODO: add slider for background density
// Create better light mode toggle