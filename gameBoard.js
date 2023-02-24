let gameBoard = [];

export function clearBoard() {
    for (let square of gameBoard) {
        square = '';
    }
}

export function addMark(symbol, index) {
    gameBoard[index] = symbol;
}

export function checkForWinner(index) {

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combo of winningCombinations) {
        if (combo.includes(parseInt(index))) {
            if (gameBoard[combo[0]] === gameBoard[combo[1]]
                 && gameBoard[combo[1]] === gameBoard[combo[2]]) {
                return true;
            }
        }
    }

    if (gameBoard.length === 9) {
        console.log('Tie Game');
    }

    return false;
}