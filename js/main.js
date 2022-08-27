// grab neccessary elements
const canvas = document.querySelector('#canvas')
const startButton = document.querySelector('#start-stop')
const startText  = document.querySelector('#start')
const score = document.querySelector('#score')
const lives = document.querySelector('#lives')
const modal = document.querySelector('#htp-modal')
const modalX = document.querySelector('.modal-close')
const htpButton = document.querySelector('#htp')

// set canvas dimensions 960 x 540 + extra context stuff
const ctx = canvas.getContext('2d')
canvas.setAttribute('height', getComputedStyle(canvas)['height'])
canvas.setAttribute('width', getComputedStyle(canvas)['width'])
// for sharp pixel art
ctx.imageSmoothingEnabled = false
// shadows under images for visibility
ctx.shadowColor = "rgba(0, 0, 0, .7)"
ctx.shadowBlur = 3
ctx.shadowOffsetX = 7
ctx.shadowOffsetY = 7

// HTP Modal
function showHide(){
    if (modal.classList.contains("hidden")){
        modal.classList.remove("hidden")
    } else {
        modal.classList.add("hidden")
    }
}

htpButton.addEventListener('click', showHide)
modalX.addEventListener('click', showHide)

// DECLARE AND DEFINE GLOBAL VARIABLES
let currentFrame = 0
let currentScore = 0
let update = null
let playerTimeout = null
let enemyTimeout = null
const images = {}
const imageReady = {} // unsure if needed
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
    loadImage('roastedchicken.png', 'roastedChicken')
    loadImage('roastedchicken_dish.png', 'roastedChickenDish')
    loadImage('waffle.png', 'waffle')
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
    //     ctx.fillStyle = this.image // color
    //     ctx.fillRect(this.x, this.y, this. width, this.height)
    // }

    render() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

class PlayerChr extends Object {
    constructor (x, y, width, height, speed, image) {
        super(x, y, width, height, speed, image)
        this.life = 3
        this.livesLeft = ["Game Over!", "🍓", "🍓🍓", "🍓🍓🍓"]
    }
}

// creates player character
const waffle = new PlayerChr(320, 245, 64, 64, 32, images.waffleDish)

// player movement + shooting handler
function playerMovement(e) {
        switch (e.key) {
            // UP
            // case('ArrowUp'):
            case('w'): // pressing both doubles the movement -- might try something else
                waffle.y -= waffle.speed
                if (waffle.y < 0) {
                    waffle.y = 0
                }
                break
            // DOWN
            // case('ArrowDown'):
            case('s'):
                waffle.y += waffle.speed
                if (waffle.y + waffle.height > canvas.height) {
                    waffle.y = canvas.height - waffle.height
                }
                break
            // LEFT
            // case('ArrowLeft'):
            case('a'):
                waffle.x -= waffle.speed
                if (waffle.x < 0) {
                    waffle.x = 0
                }
                break
            // RIGHT
            // case('ArrowRight'):
            case('d'):
                waffle.x += waffle.speed
                if (waffle.x + waffle.width > canvas.width) {
                    waffle.x = canvas.width - waffle.width
                }
                break
            // SHOOT
            case(' '):
                e.preventDefault() // prevents scrolling the page with arrow keys and space
                bullets.push(new Object(waffle.x + waffle.width, waffle.y + waffle.height/3, 32, 32, 16, images.dish))
                break
            default: break
        }
}

// no more page scrolling with space bar
window.addEventListener('keydown', e => {
    if (e.key === ' ') {
        e.preventDefault()
    }
})

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
                        currentScore += 100
                        score.innerText = `Score: ${currentScore}`
                        bullets[i].alive = false
                        enemies[j].alive = false
                        enemyTimeout = setTimeout(() => {
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

// for spawning enemeis at random times
function randomFrame(num) {
    if (num === 1){
        return 50
    } else {
        return 100
    }
}

// enemy creation and placement
function newEnemy() {
    // will create enemies at random Y location off screen
    let randomY = randomNum(461)
    let randomYHalf = randomNum(231)
    if (currentFrame > 3600) {
        // 120~ seconds its boss time
        clearInterval(update)
        update = setInterval(bossTime, 34)
    } else if (currentFrame > 2700) {
        // 90~ seconds spawns more enemies at a time
        enemies.push(new Object(960, randomYHalf, 96, 96, randomNum(7) + 18, images.roastedChicken, images.roastedChickenDish))
        enemies.push(new Object(960, randomYHalf + 230, 96, 96, randomNum(7) + 18, images.roastedChicken, images.roastedChickenDish))
    } else if (currentFrame > 1800) {
        // 60~ seconds spawns even faster enemies
        enemies.push(new Object(960, randomY, 96, 96, randomNum(7) + 18, images.omlet, images.omletDish))
    } else if (currentFrame > 900) {
        // 30~ seconds spawns faster enemies
        enemies.push(new Object(960, randomY, 96, 96, randomNum(7) + 12, images.bacon, images.baconDish))
    } else {
        // game starts here
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
                if (waffle.life <= 0) {
                    gameOver()
                }
            }
        }
    }
}


// when the player gets hit by a normal enemy
function playerHit () {
    clearInterval(update)
    waffle.speed = 0
    ctx.drawImage(images.waffleHit, waffle.x - 12, waffle.y - 6)
    waffle.life--
    lives.innerText = waffle.livesLeft[waffle.life]
    playerTimeout = setTimeout(() => {
        waffle.speed = 32
        update = setInterval(gameLoop, 34)
    }, 500)
}

// big boss
const bigWaffle = new Object(960, 0, 540, 540, 1, images.waffle, images.waffleDish)
bigWaffle.health = 100

// render the boss and move it
function bigBoi () {
    bigWaffle.render()
    bigWaffle.x -= bigWaffle.speed
    // check for hit between bullets and boss
    for (let i = 0; i < bullets.length; i ++) {
        if (bullets[i].alive === true) {
            if (detectHit(bullets[i], bigWaffle)) {
                bullets[i].alive = false
                bigWaffle.health--
            }
        }
    }
    if (bigWaffle.health <= 0) {
        bigWaffle.image = bigWaffle.hitImage
        bigWaffle.render()
        youWin()
    }
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

// add the start button
startButton.addEventListener('click', startGame, {once:true})

// initilize and start the game
function startGame() {
    htpButton.removeEventListener('click', showHide)
    modal.classList.add('hidden')
    document.addEventListener('keydown', playerMovement)
    waffle.x = 320
    waffle.y = 245
    waffle.life = 3
    waffle.speed = 32
    lives.innerText = "🍓🍓🍓"
    currentScore = 0
    currentFrame = 0
    score.innerText = "Score: 0"
    startText.innerText = "Restart"
    update = setInterval(gameLoop, 34)
    startButton.addEventListener('click', gameOver, {once:true})
}

// what happens every frame
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (currentFrame % randomFrame(randomNum(2)) === 0) {
        newEnemy()
    }
    currentFrame++
    waffle.render()
    spawnEnemies()
    shootBullets()
}

// what happens every frame at boss time
function bossTime () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    waffle.render()
    shootBullets()
    spawnEnemies()
    bigBoi()
    if (detectHit(waffle, bigWaffle)) {
        gameOver()
    }
}

// when its game over
function gameOver() {
    clearTimeout(playerTimeout)
    clearTimeout(enemyTimeout)
    clearInterval(update)
    document.removeEventListener('keydown', playerMovement)
    // clears out both arrays
    while (bullets.length > 0) {
        bullets.pop()
    }
    while (enemies.length > 0) {
        enemies.pop()
    }
    startText.innerText = "Try again?"
    startButton.removeEventListener('click', gameOver)
    startButton.addEventListener('click', startGame, {once:true})
    htpButton.addEventListener('click', showHide)
}

// when you kill the boss
function youWin() {
    clearInterval(update)
    document.removeEventListener('keydown', playerMovement)
    while (bullets.length > 0) {
        bullets.pop()
    }
    while (enemies.length > 0) {
        enemies.pop()
    }
    lives.innerText = "You win"
    score.innerText = `Congrats Breakfast Boss. Score: ${currentScore}`
    startText.innerText = "Again?"
    startButton.removeEventListener('click', gameOver)
    startButton.addEventListener('click', startGame, {once:true})
    htpButton.addEventListener('click', showHide)
}