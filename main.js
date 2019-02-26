import rules from "./rules.js"

document.onreadystatechange = () => {
	if (document.readyState === 'complete') {
		const mainCanvas = document.getElementById('main-canvas')
		const ctx = mainCanvas.getContext('2d')
		const grid = 100
		const boardSize = {x: mainCanvas.scrollWidth, y: mainCanvas.scrollHeight}
		const cellSize = {x: boardSize.x / grid, y: boardSize.y / grid}

		mainCanvas.width = boardSize.x;
		mainCanvas.height = boardSize.y;

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
			ctx.fillRect(x*cellSize.x, y*cellSize.y, cellSize.x, cellSize.y)
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
			}, 20)
		}


		// Event handlers ---------------------------------------------------

		// Set  up button clicks
		const buttonIterate = document.getElementById('btn-iterate')
		buttonIterate.onclick = startSimulation

		const buttonReset = document.getElementById('btn-reset')
		buttonReset.onclick = initBoard

		// Set up canvas interaction
		mainCanvas.addEventListener('click', (e)=>{
			clickCanvas(e.offsetX, e.offsetY)
		})

		function clickCanvas(x, y){
			const convertedX = Math.floor(x / cellSize.x)
			const convertedY = Math.floor(y / cellSize.y)

			if (board[convertedX][convertedY] == 0) {
				board[convertedX][convertedY] = 1
			} else {
				board[convertedX][convertedY] = 0
			}
			
			drawBoard(board)
		}

		mainCanvas.addEventListener('mousemove', (e)=>{
			highlightPixel(e.offsetX, e.offsetY)
		})

		function highlightPixel(x, y){
			drawBoard(board)

			const convertedX = Math.floor(x / cellSize.x)
			const convertedY = Math.floor(y / cellSize.y)

			ctx.fillStyle = "pink"
			ctx.fillRect(convertedX*cellSize.x, convertedY*cellSize.y, cellSize.x, cellSize.y)
		}

		initBoard()
	}
}