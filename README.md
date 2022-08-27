# Fictional Waffle (the actual name now)

Fictional Waffle is a 2D top-down shoot em' up game where the player controls a waffle that fires dishes at oncoming enemies. The player can move around and shoot at approaching enemies to defeat them. If an enemy touches the player character, they will take damage and if the player takes too much damage, it's game over.

### Come play it here

https://average-alien.github.io/fictional-waffle/

## Tech used

- Canvas game
- HTML5/CSS for basic page layout and setting up a canvas
- Javascript for drawing to the canvas and overall game functionality
- Some DOM manipulation for the start/restart buttons and displaying game info

## Sources

Sprites from:  
https://ghostpixxells.itch.io/pixelfood  
https://henrysoftware.itch.io/pixel-food

Font from:  
https://fonts.google.com/specimen/Silkscreen

Modal guide:  
https://www.w3schools.com/howto/howto_css_modals.asp

## Approach taken

On the first day, after getting my pitch approved, I went ahead and set up the skeleton of my site and did a bit of psuedo coding to plan out what needed to be done for my game. From the second day onwards I went through my psuedo code and worked on replacing it with functional code. If I ran into any hiccups I would double check my code first for any syntax or spelling errors (what the problem usually is). Else if the problem still persisted I was generally able to debug it after a bit of tweaking and Googling. When I had all the main components of my game in place and an MVP ready, I went ahead and started working on some stretch goals and cleaning up or making improvements to the code until the final day.

## Post project reflection

Overall I think this project was both challenging and a great learning experience. I was a little worried at first about creating my own game, but I ended up enjoying coming up with random ideas and implementing them. Although I think spending a bit more time planning out my project would have been the better path to take over figuring out the specs on the fly. But I am pretty happy with how the game turned out for now, however there are definetly a few areas that I think could use some improvement.

- The player movement handler could be more responsive and smoother
- The hit boxes for some objects could be improved
- Should find a better way to determine and control enemy spawn timings

## Wireframes

![wireframe](./media/P1%20wireframe.png)

## MVP Goals

- render a player character ✅
- render multiple enemies ✅
- player can move their character ✅
- player can shoot at enemies ✅
- enemies die when they are shot ✅
- have enemies move towards the player ✅
- player takes damage when enemy reaches them ✅
- game over if player takes too much damage ✅
- player wins when theres no more enemies ✅

## Stretch Goals

- mulitple stages
- power ups for the player
- incorporate ~~cool~~ cute assets ✅
- if possible, add some animiations ✅ but they're pretty simple
- different enemy types ✅
- different player characters with different bullet properties

## Potential Roadblocks

- getting multiple enemies to spawn
- getting them to move towards the player
- setting up proper hitboxes for enemies, bullets, and the player character