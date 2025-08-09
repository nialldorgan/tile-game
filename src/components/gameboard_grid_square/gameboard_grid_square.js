export default class GameBoardGridSquare {

    constructor (index, row, col) {
        this.index = index
        this.row = row
        this.col = col
        this.gridPiece = null
        this.view = null
        this.renderGridSquare()
        this.view.addEventListener('gamePieceClick', this.onClick.bind(this))      
    }

    renderGridSquare () {
        this.view = document.createElement('div')
        this.view.classList.add('grid_square')      
    }

    hasGridPiece () {
        return !!this.gridPiece
    }

    getGridPiece () {
        return this.gridPiece
    }

    setGridPiece (gridPiece) {
        this.gridPiece = gridPiece
        this.view.appendChild(this.gridPiece.getPiece())        
    }

    setCorrectPieceIndexArray (indexArray) {
        this.correctPieceIndexArray = indexArray
    }

    hasCorrectPiece () {
        if (!this.hasGridPiece()) {
            if ( this.correctPieceIndexArray.length === 0) {
                return true
            }
            return false
        }
        else {
            return this.correctPieceIndexArray.includes(this.getGridPiece().getPieceIndex())
        }
    }

    removePiece (gridPiece) {
        this.gridPiece = null
        this.view.removeChild(gridPiece.getPiece())
    }

    getGridSquare () {
        return this.view
    }    

    onClick (event) {       
        event.target.dispatchEvent(new CustomEvent('gridSquareClick', {bubbles: true, detail: this}))
    }
}