export default {
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