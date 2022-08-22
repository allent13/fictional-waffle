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
    alive: true,
    render(){
        ctx.fillStyle = char.color
        ctx.fillRect(char.x, char.y, char.width, char.height)
    }
}

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
    render(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let pancake = new Enemy(200, 300, 100, 100, 'red')

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
class Bullet {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.width = 20
        this.height = 10
        this.color = color

    }
    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let butter = new Bullet(100, 100, 'yellow')

// enemy render/placement

// enemy movement?

// collision algo
function detectHit(objOne, objTwo) {
    const top = objOne.y + objOne.height >= objTwo.y
    const right = objOne.x <= objTwo.x + objTwo.width
    const bottom = objOne.y <= objTwo.y + objTwo.height
    const left = objOne.x + objOne.width >= objTwo.x
    if (top && right && bottom && left){
        console.log('hit')
        return true
    } else {
        return false
    }
}

// define gameplay loop
let runGame = setInterval(gameLoop, 60)

function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    char.render()
    pancake.render()
    butter.render()
    detectHit(char, pancake)
    detectHit(char, butter)
}