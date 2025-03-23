const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const cols = 40
const rows = 20
const cellW = canvas.width / cols
const cellH = canvas.height / rows

const grids = []
let gameRunning = false
let lastButton = null

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

function filling(event) {
    if (!gameRunning) {
        let x = Math.floor(event.offsetX / cellW)
        let y = Math.floor(event.offsetY / cellH)
        grid[y][x] = grid[y][x] === 1 ? 0 : 1;
        drawGrid();
    }
}

function drawGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] == 1) {
                let img = new Image();
                img.src = 'img/new.png';
                img.onload = () => {
                    ctx.drawImage(img, j * cellW, i * cellH, cellH, cellW);
                }
            } else if (prevGrid[i][j] == 1) {
                let img = new Image();
                img.src = 'img/rip.png';
                img.onload = () => {
                    ctx.drawImage(img, j * cellW, i * cellH, cellH, cellW);
                }
            } else {
                ctx.clearRect(j * cellW, i * cellH, cellW, cellH);
                net()
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

function clear() {
    grid = new Array(rows)
    prevGrid = new Array(rows)
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(0)
        prevGrid[i] = new Array(cols).fill(0)
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    net()
    gameRunning = false
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
    grids.push(grid)
    if (grids.length > 7) grids.shift()

    prevGrid = grid.slice()
    grid = newGrid
}

function stopGame() {
    gameRunning = false
}

function startGame() {
    gameRunning = true;
    gameLoop();
}

function gameLoop() {
    if (gameRunning) {
        drawGrid()
        updateGrid()
        setTimeout(gameLoop, 3000)
    }
}

function next() {
    gameRunning = false
    drawGrid()
    updateGrid()
}

function previous() {
    if (grids.length > 0) {
        gameRunning = false;
        grid = grids.pop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        net();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (grid[i][j] === 1) {
                    let img = new Image();
                    img.src = 'img/new.png';
                    img.onload = () => {
                        ctx.drawImage(img, j * cellW, i * cellH, cellW, cellH);
                    };
                }
            }
        }
    }
}

function updateColorButton(but){
if (lastButton) lastButton.style.color = "#991ad4"
but.style.color = "#9b9b9b"
lastButton = but
}

net()

canvas.addEventListener('click', filling)
document.getElementById('start').addEventListener('click', function (){
updateColorButton(this)
startGame()
})
document.getElementById('stop').addEventListener('click', function (){
    updateColorButton(this)
stopGame()
})
document.getElementById('clear').addEventListener('click', function (){
    updateColorButton(this)
    clear()
})
document.getElementById('next').addEventListener('click', function (){
    updateColorButton(this)
    next()
})
document.getElementById('previous').addEventListener('click', function (){
    updateColorButton(this)
    previous()
})