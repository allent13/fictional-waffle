// grab neccessary elements
const canvas = document.querySelector('#canvas')
const startButton = document.querySelector('#top-right')
const startText  = document.querySelector('#start')
const score = document.querySelector('#score')
const lives = document.querySelector('#lives')

// set canvas dimensions 960 x 540 + extra context stuff
const ctx = canvas.getContext('2d')
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])
ctx.imageSmoothingEnabled = false
ctx.shadowColor = "rgba(0, 0, 0, .7)"
ctx.shadowBlur = 3
ctx.shadowOffsetX = 7
ctx.shadowOffsetY = 7

// DECLARE AND DEFINE GLOBAL VARIABLES
let currentFrame = 0
let currentScore = 0
let update = null
let myTimeout = null
const images = {}
const imageReady = {} // unsure if needed -- see image loading
const bullets = []
const enemies = []

// IMAGE LOADING -- make sure images are loaded before drawing
function loadImage(location, keyName) {
    imageReady[keyName] = false
    let img = new Image()
    img.src = `./media/${location}`
    images[keyName] = img
    // unsure if needed but just in case
    img.onload = () => {
        imageReady[keyName] = true
    }
}

// asset prep
function loadAllImages () {
    loadImage('waffle_dish.png', 'waffleDish')
    loadImage('flying_strawberry.png', 'waffleHit')
    loadImage('dish.png', 'dish')
    loadImage('pancakes.png', 'pancakes')
    loadImage('pancakes_dish.png', 'pancakesDish')
    loadImage('bacon.png', 'bacon')
    loadImage('bacon_dish.png', 'baconDish')
    loadImage('omlet.png', 'omlet')
    loadImage('omlet_dish.png', 'omletDish')
}

loadAllImages()

// creating class for player, enemies, and bullets
class Object {
    constructor (x, y, width, height, speed, image, hitImage) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speed = speed
        this.image = image
        this.hitImage = hitImage
        this.alive = true
        this.hit = false
    }
    
    // FOR DEBUGGING
    // render() { 
    //     ctx.fillStyle = this.image
    //     ctx.fillRect(this.x, this.y, this. width, this.height)
    // }

    render() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

class PlayerChr extends Object {
    constructor (x, y, width, height, speed, image, hitImage) {
        super(x, y, width, height, speed, image, hitImage)
        this.life = 3
        this.livesLeft = ["Game Over!", "🍓", "🍓🍓", "🍓🍓🍓"]
    }
}

const waffle = new PlayerChr(320, 245, 64, 64, 32, images.waffleDish)

// player movement + shooting handler
function playerMovement(e) {
        switch (e.key) {
            // UP
            case('ArrowUp'):
            // case('w'): pressing both doubles the movement -- might try something else
                e.preventDefault() // prevents scrolling the page with arrow keys
                waffle.y -= waffle.speed
                if (waffle.y < 0) {
                    waffle.y = 0
                }
                break
            // DOWN
            case('ArrowDown'):
            // case('s'):
                e.preventDefault()
                waffle.y += waffle.speed
                if (waffle.y + waffle.height > canvas.height) {
                    waffle.y = canvas.height - waffle.height
                }
                break
            // LEFT
            case('ArrowLeft'):
            // case('a'):
                e.preventDefault()
                waffle.x -= waffle.speed
                if (waffle.x < 0) {
                    waffle.x = 0
                }
                break
            // RIGHT
            case('ArrowRight'):
            // case('d'):
                e.preventDefault()
                waffle.x += waffle.speed
                if (waffle.x + waffle.width > canvas.width) {
                    waffle.x = canvas.width - waffle.width
                }
                break
            // SHOOT
            case(' '):
                e.preventDefault()
                bullets.push(new Object(waffle.x + waffle.width, waffle.y + waffle.height/3, 32, 32, 16, images.dish))
                break
            default: break
        }
}

// bullet render and hit detection
function shootBullets() {
    // loop through all the bullets
    for (let i = 0; i < bullets.length; i++) {
        // if the bullet is live, render and move it
        if (bullets[i].alive) {
            bullets[i].render()
            bullets[i].x += bullets[i].speed
            // kill bullet when it reaches edge of canvas
            if (bullets[i].x > 960) {
                bullets[i].alive = false
            }
            // check for hit between bullet and enemies
            for (let j = 0; j < enemies.length; j++){
                if (enemies[j].alive) {
                    if (detectHit(bullets[i], enemies[j])) {
                        enemies[j].hit = true
                        enemies[j].speed = 0
                        enemies[j].image = enemies[j].hitImage
                        currentScore += 1000
                        score.innerText = `Score: ${currentScore}`
                        bullets[i].alive = false
                        enemies[j].alive = false
                        setTimeout(() => {
                            enemies[j].hit = false
                        }, 500)
                    }
                }
            }
        }
    }
}

// random number generator
function randomNum(max) {
    return Math.floor(Math.random() * max)
}

function randomFrame(num) {
    if (num === 1){
        return 50
    } else {
        return 100
    }
}

// enemy creation and placement
function newEnemy() {
    let randomY = randomNum(461)
    // creates enemy at random y offscreen, creates faster enemeies after 30~ and 60~ seconds
    if (currentFrame > 1020) {
        enemies.push(new Object(960, randomY, 96, 96, randomNum(7) + 18, images.omlet, images.omletDish))
    } else if (currentFrame > 510) {
        enemies.push(new Object(960, randomY, 96, 96, randomNum(7) + 12, images.bacon, images.baconDish))
    } else {
        enemies.push(new Object(960, randomY, 96, 96, randomNum(7) + 6, images.pancakes, images.pancakesDish))
    }
}

function spawnEnemies() {
    // loop through all the enemies
    for (i = 0; i < enemies.length; i++){
        // if enemy is alive, render it and move it 
        if (enemies[i].alive || enemies[i].hit) {
            enemies[i].render()
            enemies[i].x -= enemies[i].speed
            // kill enemy when it reaches edge of canvas
            if (enemies[i].x < -100) {
                enemies[i].alive = false
            }
            // check for hit between enemy and player
            if (detectHit(enemies[i], waffle)){
                enemies[i].alive = false
                playerHit()
            }
        }
    }
}

function playerHit () {
    clearInterval(update)
    ctx.drawImage(images.waffleHit, waffle.x - 12, waffle.y - 6)
    waffle.speed = 0
    waffle.life--
    lives.innerText = waffle.livesLeft[waffle.life]
    myTimeout = setTimeout(() => {
        waffle.speed = 32
        update = setInterval(gameLoop, 34)
    }, 500)
}

// COLLISION DETECTION ALGO
function detectHit(objOne, objTwo) {
    const top = objOne.y + objOne.height - 10 >= objTwo.y + 10
    const right = objOne.x + 10 <= objTwo.x + objTwo.width - 10
    const bottom = objOne.y + 10 <= objTwo.y + objTwo.height - 10
    const left = objOne.x + objOne.width - 10 >= objTwo.x + 10
    if (top && right && bottom && left) {
        return true
    } else {
        return false
    }
}

// gameplay loop
startButton.addEventListener('click', startGame, {once:true})

// initilize the game
function startGame() {
    waffle.x = 320
    waffle.y = 245
    waffle.life = 3
    lives.innerText = "🍓🍓🍓"
    currentScore = 0
    score.innerText = "Score: 0"
    startText.innerText = "Restart"
    startButton.addEventListener('click', gameOver, {once:true})
    update = setInterval(gameLoop, 34)
    document.addEventListener('keydown', playerMovement)
}

// what happens every frame
function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (currentFrame % randomFrame(randomNum(2)) === 0){
        newEnemy()
    }
    currentFrame++
    waffle.render()
    spawnEnemies()
    shootBullets()
    if (waffle.life <= 0) {
        gameOver()
    }
}

// when its game over
function gameOver() {
    clearTimeout(myTimeout)
    clearInterval(update)
    document.removeEventListener('keydown', playerMovement)
    currentFrame = 0
    while (bullets.length > 0) {
        bullets.pop()
    }
    while (enemies.length > 0) {
        enemies.pop()
    }
    startText.innerText = "Try again!"
    startButton.addEventListener('click', startGame, {once:true})
}