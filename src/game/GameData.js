

let gameData = {
    //data for building board
    rows: 15,
    columns: 15,
    numberOfMines: 40,

    //persistent data on cells
    board: [[]], // each element contains [value, classState, xIndex, yIndex] for passing on to Cell during creation 
    nonMinesLeft: 0
}

export default gameData