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

// DECLARE AND DEFINE VARIABLES
let gameState = 0
class Object {
    constructor (x, y, width, height, speed, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.color = color
        this.alive = true
    }
    
    render() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this. width, this.height)
    }
}

class PlayerChr extends Object {
    constructor (x, y, width, height, speed, color) {
        super(x, y, width, height, speed, color)
        this.life = 3
    }
}

const waffle = new PlayerChr(25, 245, 50, 50, 10, 'blue')
const butter = []
const pancakes = []

// player movement + shooting handler
document.addEventListener('keypress', e => {
    if (waffle.alive){
        switch (e.key) {
            case('w'):
                waffle.y -= waffle.speed
                if (waffle.y < 0) {
                    waffle.y = 0
                }
                break
            case('s'):
                waffle.y += waffle.speed
                if (waffle.y + waffle.height > canvas.height) {
                    waffle.y = canvas.height - waffle.height
                }
                break
            case('a'):
                waffle.x -= waffle.speed
                if (waffle.x < 0) {
                    waffle.x = 0
                }
                break
            case('d'):
                waffle.x += waffle.speed
                if (waffle.x + waffle.width > canvas.width) {
                    waffle.x = canvas.width - waffle.width
                }
                break
            case(' '):
                butter.push(new Object(waffle.x + waffle.width, waffle.y + 25, 20, 10, 20, 'yellow'))
                break
            }}
        })

// bullet render and movement
function shootButter() {
    for (let i = 0; i < butter.length; i++) {
        if (butter[i].alive) {
            butter[i].render()
            butter[i].x += butter[i].speed
            for (let j = 0; j < pancakes.length; j++){
                if (pancakes[j].alive) {
                    if (detectHit(butter[i], pancakes[j])) {
                        butter[i].alive = false
                        pancakes[j].alive = false
                    }
                }

            }
        }
    }
}

// enemy render/placement
function newPancake() {
    let randomY = Math.round(Math.random() * 440)
    pancakes.push(new Object(960, randomY, 100, 100, 10, 'orange'))
}


// collision algo
function detectHit(objOne, objTwo) {
    const top = objOne.y + objOne.height >= objTwo.y
    const right = objOne.x <= objTwo.x + objTwo.width
    const bottom = objOne.y <= objTwo.y + objTwo.height
    const left = objOne.x + objOne.width >= objTwo.x
    if (top && right && bottom && left){
        return true
    } else {
        return false
    }
}

// define gameplay loop
let updateGame = setInterval(gameLoop, 60)
let spawnEnemy = setInterval(newPancake, 1000)

function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    gameState++
    waffle.render()
    shootButter()
    for (i = 0; i < pancakes.length; i++){
        if (pancakes[i].alive) {
        pancakes[i].render()
        pancakes[i].x -= pancakes[i].speed
        if (pancakes[i].x < -50) {
            pancakes[i].alive = false
        }
        }
    }
}