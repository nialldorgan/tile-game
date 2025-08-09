// import config from '../../../config.json' assert {type: "json"}

export default class GameBoardModel {

    constructor (gridSize, gridSquareSize) {
        this.gameGrid = []
        this.gridSize = gridSize
        this.gridSquareSize = gridSquareSize
        this.gameMatrix = []
        this.userMoves = 0
        this.userTimer = 0        
    }    

    getGameGrid () {
        return this.gameGrid
    }

    getGridSize () {
        return this.gridSize
    }

    getGridSquareSize () {
        return this.gridSquareSize
    }

    incrementUserMoves () {
        this.userMoves++
    }

    incrementUserTimer () {
        this.userTimer++
    }

    resetUserMoves () {
        this.userMoves = 0
    }

    getUserMoves () {
        return this.userMoves
    }

    getEmptySquare () {
        return this.gameGrid.find(square => {
            return !square.hasGridPiece()
        })
    }

    getUserTimer () {
        return this.userTimer
    }

    resetUserTimer () {
        this.userTimer = 0
    }

    getDefaultVictoryMatrix () {
        let matrix = []
        for (let i = 1; i < this.gridSize * this.gridSize; i++ ) {
            matrix.push([i])
        }
        matrix.push([])
        return matrix
    }

    setVictoryMatrix (victoryMatrix) {
        if (this.gameGrid.length !== victoryMatrix.length) {
            throw new Error('Incompatible victory matrix')
        }
        this.gameGrid.forEach((grid, index) => {
            grid.setCorrectPieceIndexArray(victoryMatrix[index])
        })
    }

    checkForVictory () {
        let winner = true
        this.gameGrid.forEach(square => {
            if (!square.hasCorrectPiece()) {
                winner = false
            }
        })
        return winner
    }  

    getNeighbouringSquares (square) {
        let neighbours = []
        if (square.row > 0 && square.row < this.gridSize - 1) {
            neighbours.push({row: square.row + 1, col: square.col})
            neighbours.push({row: square.row - 1, col: square.col})
        } else if (square.row === 0) {
            neighbours.push({row: square.row + 1, col: square.col})
        } else if (square.row === this.gridSize -1) {
            neighbours.push({row: square.row - 1, col: square.col})
        }
        if (square.col > 0 && square.col < this.gridSize - 1) {
            neighbours.push({row: square.row, col: square.col - 1})
            neighbours.push({row: square.row, col: square.col + 1})
        } else if (square.col === 0) {
            neighbours.push({row: square.row, col: square.col + 1})
        } else if (square.col === this.gridSize -1) {
            neighbours.push({row: square.row, col: square.col - 1})
        }
        return neighbours
    }

    findGridSquareByRowCol (row, col) {
        return this.gameGrid.find(gridSquare => {
            return gridSquare.row === row && gridSquare.col === col
        })
    }
}