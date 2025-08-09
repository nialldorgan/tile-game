import GameBoardModel from './gameboard_model.js'
import GameBoardView from './gameboard_view.js'



export default class GameBoard {

    constructor (gridSize, gridSquareSize, options = []) {        
        this.gridSize = gridSize
        this.gridSquareSize = gridSquareSize
        this.gameBoard = document.querySelector('#board')
        this.gameBoardModel = new GameBoardModel(gridSize, gridSquareSize)
        this.gameBoardView = new GameBoardView(this.gameBoard, this.gameBoardModel, options)
        this.gameBoard.addEventListener('gridSquareClick', this.onPieceClick.bind(this))
        this.gameBoard.addEventListener('newGame', this.onNewGame.bind(this))
        this.currentGame = 0
    }

    onPieceClick (event) {
        if (this.currentGame === 0) 
        {
            return
        }
        let squareSelected = event.detail
        let gridPiece = squareSelected.getGridPiece()
        let neighbours = this.gameBoardModel.getNeighbouringSquares(squareSelected)
        neighbours.forEach(neighbour => {
            let neighbourSquare = this.gameBoardModel.findGridSquareByRowCol(neighbour.row, neighbour.col)
            if (!neighbourSquare.hasGridPiece()) {
                squareSelected.removePiece(gridPiece)
                neighbourSquare.setGridPiece(gridPiece)
                this.gameBoardModel.incrementUserMoves()                
            }
        })
        if (this.checkForVictory()) {
            this.gameBoardView.stopGameCounters()
            alert('You won')
        }
    }

    checkForVictory () {
        return this.gameBoardModel.checkForVictory()
    }

    onNewGame (event) {
        this.gameBoardView.shuffleBoard()
        .then(() => {
            this.gameBoardModel.resetUserMoves()
            this.gameBoardModel.resetUserTimer()
            this.gameBoardView.startNewGame()
            this.currentGame++
        })
    }

}