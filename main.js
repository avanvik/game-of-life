// import rules from "./rules.js"

const mainCanvas = document.getElementById('main-canvas')
const ctx = mainCanvas.getContext('2d')
const grid = 100
const boardSize = mainCanvas.offsetWidth
const cellSize = boardSize / grid
let loop
let rules = {
  one: (pix)=>{
		// Any live cell with fewer than two live neighbors dies, as if by underpopulation.
		var sum = getPixelValue(pix.x + 1, pix.y) + 
      				getPixelValue(pix.x - 1, pix.y) +
      				getPixelValue(pix.x, pix.y + 1) +
      				getPixelValue(pix.x, pix.y - 1) + 
							getPixelValue(pix.x + 1, pix.y - 1) +
      				getPixelValue(pix.x - 1, pix.y + 1) +
      				getPixelValue(pix.x - 1, pix.y - 1) +
      				getPixelValue(pix.x + 1, pix.y + 1)
							
    return ( getPixelValue(pix.x, pix.y) == 1 && sum < 2) ? false : true
  },
	two: (pix)=>{
		// Any live cell with two or three live neighbors lives on to the next generation.
		var sum = getPixelValue(pix.x + 1, pix.y) + 
      				getPixelValue(pix.x - 1, pix.y) +
							getPixelValue(pix.x, pix.y + 1) +
							getPixelValue(pix.x, pix.y - 1) + 
							getPixelValue(pix.x + 1, pix.y - 1) +
							getPixelValue(pix.x - 1, pix.y + 1) +
							getPixelValue(pix.x - 1, pix.y - 1) +
							getPixelValue(pix.x + 1, pix.y + 1)
								
		return (getPixelValue(pix.x, pix.y) == 1 && (sum == 2 || sum == 3)) ? true : false
	},
	three: (pix)=>{
		// Any live cell with more than three live neighbors dies, as if by overpopulation.
		var sum = getPixelValue(pix.x + 1, pix.y) + 
							getPixelValue(pix.x - 1, pix.y) +
							getPixelValue(pix.x, pix.y + 1) +
							getPixelValue(pix.x, pix.y - 1) + 
							getPixelValue(pix.x + 1, pix.y - 1) +
							getPixelValue(pix.x - 1, pix.y + 1) +
							getPixelValue(pix.x - 1, pix.y - 1) +
							getPixelValue(pix.x + 1, pix.y + 1)
								
		return (getPixelValue(pix.x, pix.y) == 1 && sum > 3) ? false : true
	},
	four: (pix)=>{
		// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
		var sum = getPixelValue(pix.x + 1, pix.y) + 
							getPixelValue(pix.x - 1, pix.y) +
							getPixelValue(pix.x, pix.y + 1) +
							getPixelValue(pix.x, pix.y - 1) + 
							getPixelValue(pix.x + 1, pix.y - 1) +
							getPixelValue(pix.x - 1, pix.y + 1) +
							getPixelValue(pix.x - 1, pix.y - 1) +
							getPixelValue(pix.x + 1, pix.y + 1)
								
		return ( getPixelValue(pix.x, pix.y) == 0 && sum == 3) ? true : false
	}
}

mainCanvas.width = boardSize;
mainCanvas.height = boardSize;

let board = []

function clickCanvas(x, y){
	const convertedX = Math.floor(x / cellSize)
	const convertedY = Math.floor(y / cellSize)
	
	board[convertedX][convertedY] = 1
	drawBoard()
}

// Init board
function initBoard(){
	board = []
	clearInterval(loop)
	for (var x = 0; x < grid; x++) {
		board.push([])
		for (var y = 0; y < grid; y++) {
			board[x].push(0)
		}
	}
	drawBoard()
}

// Process a pixel
function forEachPixel(operation) {
  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      operation({x: x, y: y})
    }
  }
}

// Draw whole board
function drawBoard(){
	forEachPixel((pix) => {
		drawPixel(pix.x, pix.y)
	})
}

// Securely get one pixel
function getPixelValue(x, y){
	if (x in board && y in board[x]){
		return board[x][y]
	} else {
		return 0
	}
}

// Draw one pixel at x, y
function drawPixel(x, y){
	ctx.fillStyle = board[x][y] ? "black" : "white"
	ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize)
}

function iterate() {
	let boardBuffer = JSON.parse(JSON.stringify(board))
	
  forEachPixel((pix) => {
		if (rules.two(pix) || rules.four(pix)) {
			boardBuffer[pix.x][pix.y] = 1
		} else if (rules.one(pix) || rules.three(pix)) {
			boardBuffer[pix.x][pix.y] = 0
		}
  })

	board = JSON.parse(JSON.stringify(boardBuffer))
	drawBoard()
}

function startSimulation(){
	loop = setInterval(()=>{
		iterate()
	}, 100)
}

const buttonIterate = document.getElementById('btn-iterate')
buttonIterate.onclick = startSimulation

const buttonReset = document.getElementById('btn-reset')
buttonReset.onclick = initBoard
mainCanvas.addEventListener('click', (e)=>{
	clickCanvas(e.layerX, e.layerY)
})

initBoard()
