let gameBoard = [];

export function addMark(symbol, spot) {
    gameBoard[spot] = symbol;
}

export function checkForWinner(spot) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for (let combo of winningCombinations) {
        if (combo.some((element) => {element === spot})) {
            if (gameBoard[combo[0]] === gameBoard[combo[1]]
                 && gameBoard[combo[1]] === gameBoard[combo[2]]) {
                return true;
            }
        }
    }

    return false;
}