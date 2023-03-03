import { animateBackground, initializeGame, toggleLightMode, playAgain, returnToStart, toggleOptions, toggleBackground, changeBackgroundDensity } from "./displayController.js";

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

const toggleBackgroundButton = document.querySelector('#toggleBackground');
toggleBackgroundButton.addEventListener('click', toggleBackground);

const backgroundDensitySlider = document.querySelector('#backgroundDensity');
backgroundDensitySlider.addEventListener('input', changeBackgroundDensity);

animateBackground();

// TODO: add slider for background density
// Create better light mode toggle