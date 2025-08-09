'use strict'
import GameBoard from './src/components/gameboard/gameboard.js'

const victoryMatrix = [
    [1,2,5,6],
    [1,2,5,6],
    [3,4,7,8],
    [3,4,7,8],
    [1,2,5,6],
    [1,2,5,6],
    [3,4,7,8],
    [3,4,7,8],
    [9,10,13,14],
    [9,10,13,14],
    [11,12,15],
    [11,12,15],
    [9,10,13,14],
    [9,10,13,14],
    [11,12,15],
    []
]

const redPiece = {
    color: 'red',
    display_index: false,
    img: null
}
const greenPiece = {
    color: 'green',
    display_index: false,
    img: null
}
const bluePiece = {
    color: 'blue',
    display_index: false,
    img: null
}
const yellowPiece = {
    color: 'yellow',
    display_index: false,
    img: null
}

const pieceProfileArray = [
    {},
    redPiece,
    redPiece,
    greenPiece,
    greenPiece,
    redPiece,
    redPiece,
    greenPiece,
    greenPiece,
    bluePiece,
    bluePiece,
    yellowPiece,
    yellowPiece,
    bluePiece,
    bluePiece,
    yellowPiece,
]

const gameBoard = new GameBoard(4, 100)