import { addMark, checkForWinner } from "./gameBoard.js";

let playerOneTurn = true;

export function playerClick() {
    if (this.dataset.mark != null) {
        return;
    }

    if (playerOneTurn) {
        this.dataset.mark = 'Cross';
        addMark('Cross', this.dataset.index);
        if (checkForWinner(this.dataset.index)) {
            console.log('Player One Wins!');
        }
        changeTurn();
    } else {
        this.dataset.mark = 'Circle';
        addMark('Circle', this.dataset.index);
        if (checkForWinner(this.dataset.index)) {
            console.log('Player Two Wins!');
        }
        changeTurn();
    }
}

function changeTurn() {
    playerOneTurn = !playerOneTurn;
}