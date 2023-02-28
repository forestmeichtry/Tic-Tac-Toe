import { animateBackground, initializeGame, toggleLightMode } from "./displayController.js";

const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', initializeGame);

const lightModeButton = document.querySelector('#lightMode');
lightModeButton.addEventListener('click', toggleLightMode);

animateBackground();

// TODO: Make combo / board flash on win / tie
// then shift grid into box and display win message
// TODO: Detect tie gamestate before board is full
// if every possible combo is contested then initiate gameOver