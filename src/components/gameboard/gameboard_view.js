import GameBoardGridPiece from '../gameboard_grid_piece/gameboard_grid_piece.js'
import GameBoardGridSquare from '../gameboard_grid_square/gameboard_grid_square.js'
import config from '../../../config.json' with { type: "json" }

export default class GameBoardView {

    constructor (board, model, options = []) {
        this.gameBoard = board
        this.model = model
        if (options.length > 1) {
            this.gamePieceProfileMatrix = options[1]
            this.victoryMatrix = options[0]
        } else {
            this.gamePieceProfileMatrix = this.getDefaultGamePieceProfileMatrix()
            this.victoryMatrix = this.model.getDefaultVictoryMatrix()
        }
        this.renderBoard()        
    }

    /*
    create the gameboard
    */

    renderBoard () {
        this.renderUserFeedback()
        this.renderUserControls()
        this.board = document.createElement('div')
        this.gameBoard.appendChild(this.board)
        this.board.classList.add('board')
        this.board.style.display = 'grid'
        this.board.style.gridTemplateColumns = `repeat(${this.model.getGridSize()}, ${this.model.getGridSquareSize()}px)`        
        this.fillGameBoardGridSquares()
        this.addGameBoardPieces()        
    }

    /*
    create the user controls at the top of the board
    */

    renderUserControls () {
        this.userControls = document.createElement('div')
        this.userControls.classList.add('user_controls')
        this.newGameButton = this.renderNewGameButton()
        this.difficultySelector = this.renderDifficultyLevelSelector()
        this.userControls.appendChild(this.newGameButton)
        this.userControls.appendChild(this.difficultySelector)
        this.gameBoard.appendChild(this.userControls)
    }

    // create a new game button 

    renderNewGameButton () {
        let button = document.createElement('button')
        button.classList.add('new_game')
        button.addEventListener('click', this.newGame)
        button.innerHTML = 'New Game'
        return button
    }

    renderDifficultyLevelSelector () {
        let select = document.createElement('select')
        select.classList.add('difficulty_selector')
        select.addEventListener('input', this.selectDifficulty)
        config.difficulty_levels.forEach(level => {
            let opt = document.createElement('option')
            opt.value = level.moves 
            opt.text = level.level
            select.add(opt)
        })
        return select
    }

    // create the user feedback controls

    renderUserFeedback () {
        this.userFeedback = document.createElement('div')
        let moveCounter = this.renderMoveCounter()
        let userTimerContainer = this.renderTimer()
        this.userFeedback.appendChild(moveCounter)
        this.userFeedback.appendChild(userTimerContainer)
        this.userFeedback.classList.add('feedback')
        this.gameBoard.appendChild(this.userFeedback)        
        
    }

    renderMoveCounter () {
        let userMoveCounterContainer = document.createElement('div')
        userMoveCounterContainer.style.display = "grid"
        userMoveCounterContainer.style.gridTemplateColumns = "30% 70%"
        let userMoveCounterLabel = document.createElement('label')
        userMoveCounterLabel.innerHTML = "Moves made"
        this.userFeedbackMoveCounter = document.createElement('label')
        userMoveCounterContainer.appendChild(userMoveCounterLabel)
        userMoveCounterContainer.appendChild(this.userFeedbackMoveCounter)
        return userMoveCounterContainer
    }

    renderTimer () {
        let userTimerContainer = document.createElement('div')
        userTimerContainer.style.display = "grid"
        userTimerContainer.style.gridTemplateColumns = "30% 70%"
        let timerLabel = document.createElement('label')
        timerLabel.innerHTML = "Time taken"        
        this.userTimer = document.createElement('label')
        userTimerContainer.appendChild(timerLabel)
        userTimerContainer.appendChild(this.userTimer)
        return userTimerContainer
    }
    // create the gamegrid squares and add them to the board
    
    fillGameBoardGridSquares () {
        for (let i = 0; i < (this.model.getGridSize() * this.model.getGridSize()); i++) {
            let gameGridSquare = new GameBoardGridSquare(i, this.getRow(i), this.getCol(i))
            this.board.appendChild(gameGridSquare.getGridSquare())
            this.model.getGameGrid().push(gameGridSquare)
        }
        this.model.setVictoryMatrix(this.victoryMatrix)
    }

    // create the gameboard tiles and add them to the gameboard grid squares

    addGameBoardPieces () {
        for (let i = 1; i < (this.model.getGridSize() * this.model.getGridSize()) ; i++) {            
            let piece = new GameBoardGridPiece(i, this.gamePieceProfileMatrix[i])
            this.model.getGameGrid()[i-1].setGridPiece(piece)
        }
    }

    // shuffle the tiles on the board

    shuffleBoard () {
        let empty = this.model.getEmptySquare()
        let row = empty.row
        let col = empty.col
        let i = 0
        let p = Promise.resolve()
        for (let i = 0; i < this.getDifficultyLevel(); i++) {
            p = p.then(() => new Promise(resolve => setTimeout(resolve, 150)))
                .then(() => {                    
                    let neighbours = this.model.getNeighbouringSquares(empty).filter(neighbour => {
                        return neighbour.row !== row || neighbour.col !== col
                    })
                    row = empty.row
                    col = empty.col
                    let swapIndex = Math.floor(Math.random() * neighbours.length)                    
                    let newSquare = this.model.findGridSquareByRowCol(neighbours[swapIndex].row, neighbours[swapIndex].col)
                    let gridPiece = newSquare.getGridPiece()            
                    newSquare.removePiece(gridPiece)
                    empty.setGridPiece(gridPiece)
                    empty = newSquare                    
                })
        }
        return p
    }

    startNewGame () {
        if (this.userMovesInterval) {
            clearInterval(this.userMovesInterval)
        }
        if (this.userTimerInterval) {
            clearInterval(this.userTimerInterval)
        }
        this.userMovesInterval = setInterval(() => {
            this.userFeedbackMoveCounter.innerHTML = this.model.getUserMoves()
        }, 100)
        this.userTimerInterval = setInterval(() => {
            this.model.incrementUserTimer()
            this.userTimer.innerHTML = this.model.getUserTimer()
        }, 1000)
    }

    stopGameCounters () {
        clearInterval(this.userMovesInterval)
        clearInterval(this.userTimerInterval)
    }

    // emit a new game event

    newGame (event) {
        event.target.dispatchEvent(new CustomEvent('newGame', {bubbles: true, detail: this}))
    }

    selectDifficulty (event) {
        event.target.dispatchEvent(new CustomEvent('difficultySelected', { bubbles: true, detail: this}))
    }

    getDifficultyLevel () {
        return this.difficultySelector.value
    }

    // set a gamepiece profile matrix

    setGamePieceMatrix(matrix) {
        this.gamePieceProfileMatrix = matrix
    }

    // get the default matrix

    getDefaultGamePieceProfileMatrix () {
        let matrix = []
        let pieceProfile = config.default_piece_profile
        for (let i = 0; i < this.model.getGridSize() * this.model.getGridSize(); i++ ) {
            matrix.push(pieceProfile)
        }
        return matrix
    }

    // get the gameboard row from the index of the square selected

    getRow (index)
    {
        for(let i = 0; i < this.model.getGridSize(); i++) {
            if(index < this.model.getGridSize() * (i + 1)) {
                return i
            }
        }
    }

    // get the gameboard col from the index of the square selected

    getCol (index) {
        for(let i = 0; i < this.model.getGridSize(); i++) {
            if(index < this.model.getGridSize() * (i + 1)) {
                return index - (this.model.getGridSize() * i)
            }
        }
    }

}