import { playerClick } from "./displayController.js";

let gridSquares = document.querySelectorAll('.gridSquare');

gridSquares.forEach((gridSquare) => {
    gridSquare.addEventListener('click', playerClick);
});