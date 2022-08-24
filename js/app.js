// grab neccessary elements
const canvas = document.querySelector('#canvas')
const startButton = document.querySelector('#top-right')
const startText  = document.querySelector('#start')
const score = document.querySelector('#score')
const lives = document.querySelector('#lives')

// set canvas dimensions 960 x 540 + get context
const ctx = canvas.getContext('2d')
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])

// DECLARE AND DEFINE GLOBAL VARIABLES
let currentFrame = 0
let currentScore = 0
let update = null
const images = {}
const imageReady = {}

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
        this.livesLeft = ["Game Over!", "💖", "💖💖", "💖💖💖"]
    }
}

const waffle = new PlayerChr(50, 245, 50, 50, 25, 'blue')
const butter = []
const pancakes = []

// image loading -- make sure images are loaded before drawing
function loadImage(location, keyName) {
    imageReady[keyName] = false
    let img = new Image()
    img.src = `./assets/${location}`
    images[keyName] = img
    img.onload = () => {
        imageReady[keyName] = true
    }
}

// player movement + shooting handler
function playerMovement(e) {
    if (waffle.alive){
        switch (e.key) {
            // UP
            case('ArrowUp'):
                // prevents scrolling the page
                e.preventDefault()
                waffle.y -= waffle.speed
                if (waffle.y < 0) {
                    waffle.y = 0
                }
                break
            // DOWN
            case('ArrowDown'):
                e.preventDefault()
                waffle.y += waffle.speed
                if (waffle.y + waffle.height > canvas.height) {
                    waffle.y = canvas.height - waffle.height
                }
                break
            // LEFT
            case('ArrowLeft'):
                e.preventDefault()
                waffle.x -= waffle.speed
                if (waffle.x < 0) {
                    waffle.x = 0
                }
                break
            // RIGHT
            case('ArrowRight'):
                e.preventDefault()
                waffle.x += waffle.speed
                if (waffle.x + waffle.width > canvas.width) {
                    waffle.x = canvas.width - waffle.width
                }
                break
            // SHOOT
            case(' '):
                e.preventDefault()
                butter.push(new Object(waffle.x + waffle.width, waffle.y + 25, 20, 10, 20, 'yellow'))
                break
            default: break
        }
    }
}

// bullet render and hit detection
function shootButter() {
    // loop through all the bullets
    for (let i = 0; i < butter.length; i++) {
        // if the bullet is live, render and move it
        if (butter[i].alive) {
            butter[i].render()
            butter[i].x += butter[i].speed
            // kill bullet when it reaches edge of canvas
            if (butter[i].x > 960) {
                butter[i].alive = false
            }
            // check for hit between bullet and enemies
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

// enemy creation and placement
function newPancake() {
    let randomY = Math.round(Math.random() * 440)
    // creates enemy at random y offscreen, creates faster enemeies after 30~ and 60~ seconds
    if (currentFrame > 1020) {
        pancakes.push(new Object(960, randomY, 100, 100, 20, 'orange'))
    } else if (currentFrame > 510) {
        pancakes.push(new Object(960, randomY, 100, 100, 10, 'orange'))
    } else {
        pancakes.push(new Object(960, randomY, 100, 100, 5, 'orange'))
    }
}

function spawnPancakes() {
    // loop through all the enemies
    for (i = 0; i < pancakes.length; i++){
        // if enemy is alive, render it and move it 
        if (pancakes[i].alive) {
            pancakes[i].render()
            pancakes[i].x -= pancakes[i].speed
            // kill enemy when it reaches edge of canvas
            if (pancakes[i].x < -99) {
                pancakes[i].alive = false
            }
            // check for hit between enemy and player
            if (detectHit(pancakes[i], waffle)){
                pancakes[i].alive = false
                waffle.life--
                lives.innerText = waffle.livesLeft[waffle.life]
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

// asset prep
function loadAllImages () {
    loadImage('waffle_dish.png', 'waffleDish')
    loadImage('pancakes.png', 'pancakes')
    loadImage('dish.png', 'dish')
}

// gameplay loop
startButton.addEventListener('click', startGame, {once:true})

function startGame() {
    waffle.x = 50
    waffle.y = 245
    document.addEventListener('keydown', playerMovement)
    currentScore = 0
    lives.innerText = "💖💖💖"
    update = setInterval(gameLoop, 60)
    startText.innerText = "Restart"
    startButton.addEventListener('click', gameOver, {once:true})
}

function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (currentFrame % 100 === 0){
        newPancake()
    }
    currentFrame++
    waffle.render()
    spawnPancakes()
    shootButter()
    if (waffle.life <= 0) {
        gameOver()
    }
}

function gameOver() {
    clearInterval(update)
    document.removeEventListener('keydown', playerMovement)
    gameState = 0
    while (butter.length > 0) {
        butter.pop()
    }
    while (pancakes.length > 0) {
        pancakes.pop()
    }
    startText.innerText = "Try again!"
    startButton.addEventListener('click', startGame, {once:true})
}