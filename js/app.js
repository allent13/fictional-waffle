// grab neccessary elements
const canvas = document.querySelector('#canvas')
const start = document.querySelector('#top-right')
const score = document.querySelector('#score')

// set canvas dimensions 960 x 540 + get context
const ctx = canvas.getContext('2d')
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

// DECLARE AND DEFINE VARIABLES
let gameState = 0
let currentScore = 0
let update = null
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

const waffle = new PlayerChr(50, 245, 50, 50, 25, 'blue')
const butter = []
const pancakes = []

// player movement + shooting handler -- CHANGE TO ARROW KEYS
document.addEventListener('keydown', e => {
    if (waffle.alive){
        switch (e.key) {
            // UP
            case('ArrowUp'):
                waffle.y -= waffle.speed
                if (waffle.y < 0) {
                    waffle.y = 0
                }
                break
            // DOWN
            case('ArrowDown'):
                waffle.y += waffle.speed
                if (waffle.y + waffle.height > canvas.height) {
                    waffle.y = canvas.height - waffle.height
                }
                break
            // LEFT
            case('ArrowLeft'):
                waffle.x -= waffle.speed
                if (waffle.x < 0) {
                    waffle.x = 0
                }
                break
            // RIGHT
            case('ArrowRight'):
                waffle.x += waffle.speed
                if (waffle.x + waffle.width > canvas.width) {
                    waffle.x = canvas.width - waffle.width
                }
                break
            // SHOOT
            case(' '):
                butter.push(new Object(waffle.x + waffle.width, waffle.y + 25, 20, 10, 20, 'yellow'))
                break
            }}
        })

// bullet render and hit detection
function shootButter() {
    // loop through all the butter
    for (let i = 0; i < butter.length; i++) {
        // if the butter is live, render and move it
        if (butter[i].alive) {
            butter[i].render()
            butter[i].x += butter[i].speed
            // kill butter at edge of canvas
            if (butter[i].x > 960) {
                butter[i].alive = false
            }
            // check for hit between butter and pancake
            for (let j = 0; j < pancakes.length; j++){
                if (pancakes[j].alive) {
                    if (detectHit(butter[i], pancakes[j])) {
                        currentScore += 1000
                        score.innerText = `Score: ${currentScore}`
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
    pancakes.push(new Object(960, randomY, 100, 100, 5, 'orange'))
}

function spawnPancakes() {
    for (i = 0; i < pancakes.length; i++){
        if (pancakes[i].alive) {
            pancakes[i].render()
            pancakes[i].x -= pancakes[i].speed
            if (detectHit(pancakes[i], waffle)){
                waffle.life--
                pancakes[i].alive = false
            }
            if (pancakes[i].x < -99) {
                pancakes[i].alive = false
            }
        }
    }
}

// COLLISION DETECTION ALGO
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
function startGame() {
    update = setInterval(gameLoop, 60)
}
start.addEventListener('click', startGame, {once:true})



function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (gameState % 100 === 0){
        newPancake()
    }
    gameState++
    waffle.render()
    spawnPancakes()
    shootButter()
    if (waffle.life <= 0) {
        gameOver()
    }
}

function gameOver() {
    clearInterval(update)
    gameState = 0
    currentScore = 0
    while (butter.length > 0) {
        butter.pop()
    }
    while (pancakes.length > 0) {
        pancakes.pop()
    }
    console.log(butter, pancakes)
    start.addEventListener('click', startGame, {once:true})
}