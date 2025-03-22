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

net()
