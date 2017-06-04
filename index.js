'use strict'

var settings = {
    randomSeed: false,
    squareSize: 5,
    squareColor: '#6d6d6d',
    boardWidth: 0,
    boardHeight: 0
}

var rule = numberToRule(90)

function numberToBinary(number) {
    var str = number.toString(2)
    var pad = '00000000'
    return pad.substring(0, pad.length - str.length) + str
}

function numberToRule(number) {
    var binary = numberToBinary(number)
    return {
        true: {
            true: {
                true: binary[0] === '1',
                false: binary[1] === '1'
            },
            false: {
                true: binary[2] === '1',
                false: binary[3] === '1'
            }
        },
        false: {
            true: {
                true: binary[4] === '1',
                false: binary[5] === '1'
            },
            false: {
                true: binary[6] === '1',
                false: binary[7] === '1'
            }
        }
    }
}

var map = []

function getCanvas() {
    return document.getElementById('canvas')
}

function clearCanvas() {
    var canvas = getCanvas()
    getCanvasContext().clearRect(0, 0, canvas.width, canvas.height)
}

function resizeCanvas() {
    var canvas = getCanvas()
    settings.boardWidth = document.body.offsetWidth / settings.squareSize
    settings.boardHeight = document.body.offsetHeight / settings.squareSize
    canvas.width = document.body.offsetWidth
    canvas.height = document.body.offsetHeight
}

function getCanvasContext() {
    return getCanvas().getContext('2d')
}

function drawSquare(ctx, x, y) {
    ctx.fillStyle = settings.squareColor
    ctx.fillRect(
        settings.squareSize * x,
        settings.squareSize * y,
        settings.squareSize,
        settings.squareSize)
}

function seedMapRandom() {
    map = []
    for(var i = 0; i < settings.boardWidth; i++) {
        map.push([Math.round(Math.random()) === 1 ? true : false])
    }
}

function seedMapWithCenterPoint() {
    map = []
    for(var i = 0; i < settings.boardWidth; i++) {
        map.push([i === Math.round(settings.boardWidth / 2) ? true : false])
    }
}

function seedMap() {
    if (settings.randomSeed) {
        seedMapRandom()
    } else {
        seedMapWithCenterPoint()
    }
}

function getMapValue(x, y) {
    if (x < 0) {
        return false
    } else {
        if (map[x]) {
            return map[x][y] || false
        } else {
            return false
        }
    }
}

function calcAndDraw() {
    clearCanvas()
    var ctx = getCanvasContext()
    for(var x = 0; x < settings.boardWidth; x++) {
        map[x][0] && drawSquare(ctx, x, 0)
    }
    for(var y = 1; y < settings.boardHeight; y++) {
        for(var x = 0; x < settings.boardWidth; x++) {
            var a = getMapValue(x - 1, y - 1)
            var b = getMapValue(x, y - 1)
            var c = getMapValue(x + 1, y - 1)
            map[x][y] = rule[a][b][c]
            map[x][y] && drawSquare(ctx, x, y)
        }
    }
}

function initialize() {
    addEventListeners()
    resizeCanvas()
    seedMap()
    calcAndDraw()
}

function addEventListeners() {
    document.getElementById('form')
        .addEventListener('submit', calcButtonHandler)
}

function calcButtonHandler(e) {
    e.preventDefault()
    settings.randomSeed = document.getElementById('randomSeed').checked
    settings.squareSize = parseInt(document.getElementById('squareSize').value)
    clearCanvas()
    resizeCanvas()
    seedMap()
    rule = numberToRule(parseInt(document.getElementById('ruleNumber').value))
    setTimeout(function() {
        calcAndDraw()
    }, 0)
}

initialize()
