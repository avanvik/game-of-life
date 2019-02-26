// false means kill, true means make alive

export default {
  one: (currentValue, surroundingSum) => {
		// Any live cell with fewer than two live neighbors dies, as if by underpopulation.
		return (currentValue == 1 ? (surroundingSum < 2 ? 0 : 1) : currentValue)
	},
	two: (currentValue, surroundingSum) => {
		// Any live cell with two or three live neighbors lives on to the next generation.
		return (currentValue == 1 ? (surroundingSum == 2 || surroundingSum == 3 ? 1 : 0) : currentValue)
	},
	three: (currentValue, surroundingSum) => {
		// Any live cell with more than three live neighbors dies, as if by overpopulation.
		return (currentValue == 1 ? (surroundingSum > 3 ? 0 : 1) : currentValue)
	},
	four: (currentValue, surroundingSum) => {
		// Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
		return (currentValue == 0 ? (surroundingSum == 3 ? 1 : 0) : currentValue)
	}
}

// setTwo = {
//   one: (currentValue, surroundingSum) => {
// 		return (currentValue == 1 && surroundingSum < 2)
// 	},
// 	two: (currentValue, surroundingSum) => {
// 		return (currentValue == 1 && (surroundingSum == 2 || surroundingSum == 3))
// 	},
// 	three: (currentValue, surroundingSum) => {
// 		return (currentValue == 1 && surroundingSum > 3)
// 	},
// 	four: (currentValue, surroundingSum) => {
// 		return (currentValue == 0 && surroundingSum == 3)
// 	}
// }