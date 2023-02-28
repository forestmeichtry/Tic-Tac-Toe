import { animateBackground, initializeGame, toggleLightMode } from "./displayController.js";

const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', initializeGame);

const lightModeButton = document.querySelector('#lightMode');
lightModeButton.addEventListener('click', toggleLightMode);

animateBackground();