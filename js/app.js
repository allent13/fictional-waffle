// grab neccessary elements
const canvas = document.querySelector('#canvas')

// canvas stuff 960 x 540
const ctx = canvas.getContext('2d')
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

// DIY Dev tool -- click to find canvas position DELETE ME LATER
canvas.addEventListener('click', e => {
    console.log(e.offsetX, e.offsetY)
})

// define player character
const char = {
    x: 25,
    y: 245,
    width: 50,
    height: 50,
    color: 'blue',
    life: 3,
    alive: true
}

function renderChar(){
    ctx.fillStyle = char.color
    ctx.fillRect(char.x, char.y, char.width, char.height)
}

renderChar()

// create enemy class. do i need a bullet class?
class Enemy {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
    }
}

// player movement + shooting handler
document.addEventListener('keypress', e => {
    const speed = 10
    if (char.alive){
        switch (e.key) {
            case('w'):
                char.y -= speed
                if (char.y < 0) {
                    char.y = 0
                }
                break
            case('s'):
                char.y += speed
                if (char.y + char.height > canvas.height) {
                    char.y = canvas.height - char.height
                }
                break
            case('a'):
                char.x -= speed
                if (char.x < 0) {
                    char.x = 0
                }
                break
            case('d'):
                char.x += speed
                if (char.x + char.width > canvas.width) {
                    char.x = canvas.width - char.width
                }
                break
            case(' '):

                break
            }}
        })
// bullet render and movement

// enemy render/placement

// enemy movement?

// collision algo

// define gameplay loop