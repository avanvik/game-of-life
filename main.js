import rules from "./rules.js"

const mainCanvas = document.getElementById('main-canvas')
const ctx = mainCanvas.getContext('2d')
const grid = 100
const boardSize = mainCanvas.offsetWidth
const cellSize = boardSize / grid

mainCanvas.width = boardSize;
mainCanvas.height = boardSize;

let board = []
let loop

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
	drawBoard(board)
}

// Process all pixels
function forEachPixel(operation, board) {
  for (var x = 0; x < board.length; x++) {
    for (var y = 0; y < board[x].length; y++) {
      operation({x: x, y: y})
    }
  }
}

// Draw one pixel at x, y
function drawPixel(x, y){
	ctx.fillStyle = board[x][y] ? "black" : "white"
	ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize)
}

// Draw whole board
function drawBoard(board){
	forEachPixel((pix) => {
		drawPixel(pix.x, pix.y)
	}, board)
}

function processRules(board){
	// Securely get one pixel
	function getValue(x, y){
		return (x in board && y in board[x]) ? board[x][y] : 0
	}

	let boardBuffer = JSON.parse(JSON.stringify(board))
	
  forEachPixel((px) => {
		var currentValue = getValue(px.x, px.y)
		const sum = getValue(px.x + 1, px.y) + 
								getValue(px.x - 1, px.y) +
								getValue(px.x, px.y + 1) +
								getValue(px.x, px.y - 1) + 
								getValue(px.x + 1, px.y - 1) +
								getValue(px.x - 1, px.y + 1) +
								getValue(px.x - 1, px.y - 1) +
								getValue(px.x + 1, px.y + 1)

		boardBuffer[px.x][px.y] = (
			rules.one(currentValue, sum) ||
			rules.two(currentValue, sum) || 
			rules.three(currentValue, sum) || 
			rules.four(currentValue, sum)
		)
  }, boardBuffer)

	return JSON.parse(JSON.stringify(boardBuffer))
}

function iterate() {
	// TODO: Should probably not mutate board here
	board = processRules(board)
	drawBoard(board) // TODO: Should receive a board
}

function startSimulation(){
	loop = setInterval(()=>{
		iterate()
	}, 100)
}






// Event handlers ---------------------------------------------------

// Set  up button clicks
const buttonIterate = document.getElementById('btn-iterate')
buttonIterate.onclick = startSimulation

const buttonReset = document.getElementById('btn-reset')
buttonReset.onclick = initBoard

// Set up canvas interaction
mainCanvas.addEventListener('click', (e)=>{
	clickCanvas(e.layerX, e.layerY)
})

function clickCanvas(x, y){
	const convertedX = Math.floor(x / cellSize)
	const convertedY = Math.floor(y / cellSize)
	
	board[convertedX][convertedY] = 1
	drawBoard(board)
}

mainCanvas.addEventListener('mousemove', (e)=>{
	highlightPixel(e.layerX, e.layerY)
})

function highlightPixel(x, y){
	drawBoard(board)

	const convertedX = Math.floor(x / cellSize)
	const convertedY = Math.floor(y / cellSize)

	ctx.fillStyle = "pink"
	ctx.fillRect(convertedX*cellSize, convertedY*cellSize, cellSize, cellSize)
}

initBoard()


// let rules = {
//   one: (pix)=>{
// 		// Any live cell with fewer than two live neighbors dies, as if by underpopulation.
// 		var sum = getPixelValue(pix.x + 1, pix.y) + 
//       				getPixelValue(pix.x - 1, pix.y) +
//       				getPixelValue(pix.x, pix.y + 1) +
//       				getPixelValue(pix.x, pix.y - 1) + 
// 							getPixelValue(pix.x + 1, pix.y - 1) +
//       				getPixelValue(pix.x - 1, pix.y + 1) +
//       				getPixelValue(pix.x - 1, pix.y - 1) +
//       				getPixelValue(pix.x + 1, pix.y + 1)
							
//     return ( getPixelValue(pix.x, pix.y) == 1 && sum < 2) ? false : true
//   },
// 	two: (pix)=>{
// 		// Any live cell with two or three live neighbors lives on to the next generation.
// 		var sum = getPixelValue(pix.x + 1, pix.y) + 
//       				getPixelValue(pix.x - 1, pix.y) +
// 							getPixelValue(pix.x, pix.y + 1) +
// 							getPixelValue(pix.x, pix.y - 1) + 
// 							getPixelValue(pix.x + 1, pix.y - 1) +
// 							getPixelValue(pix.x - 1, pix.y + 1) +
// 							getPixelValue(pix.x - 1, pix.y - 1) +
// 							getPixelValue(pix.x + 1, pix.y + 1)
								
// 		return (getPixelValue(pix.x, pix.y) == 1 && (sum == 2 || sum == 3)) ? true : false
// 	},
// 	three: (pix)=>{
// 		// Any live cell with more than three live neighbors dies, as if by overpopulation.
// 		var sum = getPixelValue(pix.x + 1, pix.y) + 
// 							getPixelValue(pix.x - 1, pix.y) +
// 							getPixelValue(pix.x, pix.y + 1) +
// 							getPixelValue(pix.x, pix.y - 1) + 
// 							getPixelValue(pix.x + 1, pix.y - 1) +
// 							getPixelValue(pix.x - 1, pix.y + 1) +
// 							getPixelValue(pix.x - 1, pix.y - 1) +
// 							getPixelValue(pix.x + 1, pix.y + 1)
								
// 		return (getPixelValue(pix.x, pix.y) == 1 && sum > 3) ? false : true
// 	},
// 	four: (pix)=>{
// 		// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
// 		var sum = getPixelValue(pix.x + 1, pix.y) + 
// 							getPixelValue(pix.x - 1, pix.y) +
// 							getPixelValue(pix.x, pix.y + 1) +
// 							getPixelValue(pix.x, pix.y - 1) + 
// 							getPixelValue(pix.x + 1, pix.y - 1) +
// 							getPixelValue(pix.x - 1, pix.y + 1) +
// 							getPixelValue(pix.x - 1, pix.y - 1) +
// 							getPixelValue(pix.x + 1, pix.y + 1)
								
// 		return ( getPixelValue(pix.x, pix.y) == 0 && sum == 3) ? true : false
// 	}
// }