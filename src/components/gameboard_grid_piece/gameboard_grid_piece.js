export default class GameBoardGridPiece {

    constructor (index, pieceProfile)  {
        this.index = index
        this.view = document.createElement('div')
        this.view.classList.add('piece')
        this.pieceProfile = pieceProfile
        this.renderPiece()
        this.view.addEventListener('click', this.onClick.bind(this))
    }

    renderPiece () {
        this.view.style.backgroundColor = this.pieceProfile.color
        if (this.pieceProfile.display_index) {
            this.view.innerHTML = `${this.index}`
        }
        if (this.pieceProfile.img) {
            let img = this.createBackgroundImage()
            this.view.appendChild(img)
        }
    }

    createBackgroundImage () {
        let img = document.createElement('img')
        img.src = this.pieceProfile.img
        return img
    }

    getPiece () {
        return this.view
    }

    getPieceIndex () {
        return this.index
    }

    onClick (event) {       
        event.target.dispatchEvent(new CustomEvent('gamePieceClick', {bubbles: true, detail: this}))
    }
}