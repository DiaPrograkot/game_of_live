const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const cols = 40
const rows = 20
const cellW = canvas.width / cols
const cellH = canvas.height / rows

function net() {
  for (let i = 1; i < cols; i++) {
    const x = i * cellW
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.strokeStyle = 'grey'
    ctx.stroke()
  }

  for (let i = 1; i < rows; i++) {
    const y = i * cellH
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.strokeStyle = 'grey'
    ctx.stroke()
  }
}

let grid = new Array(rows)
let prevGrid = new Array(rows)
for (let i = 0; i < rows; i++) {
  grid[i] = new Array(cols).fill(0)
  prevGrid[i] = new Array(cols).fill(0)
}

function randomFilling() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = Math.random() > 0.6 ? 1 : 0
    }
  }
}

function drawGrid() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let img = new Image()
      if (grid[i][j] == 1) {
        img.src = 'img/new.png'
      } else if (prevGrid[i][j] == 1) {
        img.src = 'img/rip.png'
      }

      img.onload = () => {
        ctx.drawImage(img, j * cellW, i * cellH, cellH, cellW)
      }
    }
  }
}

function countNeighbors(x, y) {
  let count = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const r = x + i
      const c = y + j
      if (r >= 0 && r < rows && c >= 0 && c < cols) count += grid[r][c]
    }
  }
  count -= grid[x][y]
  return count
}

function updateGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  net()
  const newGrid = new Array(rows)
  for (let i = 0; i < rows; i++) {
    newGrid[i] = new Array(cols).fill(0)
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(i, j)
      if (grid[i][j] == 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[i][j] = 0
      } else if (grid[i][j] == 0 && neighbors == 3) {
        newGrid[i][j] = 1
      } else {
        newGrid[i][j] = grid[i][j]
      }
    }
  }
  prevGrid = grid.slice()
  grid = newGrid
}

function gameLoop() {
  drawGrid()
  updateGrid()
  setTimeout(gameLoop, 1000)
}

randomFilling()
drawGrid()
gameLoop()
