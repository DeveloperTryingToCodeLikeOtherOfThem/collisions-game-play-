info.setLife(5)

namespace obstacles {
    export class Obstacle {
        parent: Sprite
        ox: number
        oy: number

        constructor(parent: Sprite, ox: number, oy: number) {
            this.parent = parent
            this.ox = ox
            this.oy = oy
        }

        detectObstacle(parent: Sprite, ox: number, oy: number, object: Sprite) {
            game.onUpdate(() => {
                // make when if the obstacle is left of the object and right of the object detecting a obstacle
                if (parent.overlapsWith(object) && parent.x <= object.x) {
                    parent.x -= ox
                } else if (parent.overlapsWith(object) && parent.x >= object.x) {
                    parent.x += ox
                }
                // for when it is up or down of the object 
                if (parent.overlapsWith(object) && parent.y <= object.y) {
                    parent.y -= oy
                } else if (parent.overlapsWith(object) && parent.y >= object.y) {
                    parent.y += oy
                }
            })
        }

    }

    export function createObstacle(parent: Sprite, ox: number, oy: number): Obstacle {
        const detectObstacle = new Obstacle(parent, ox, oy)
        return detectObstacle
    }
}

let player = sprites.create(assets.image`playerImage`, SpriteKind.Player)
player.setStayInScreen(true)
let myTree: Sprite = null
game.onUpdateInterval(randint(1000, 1500), () => {
    myTree = sprites.create(assets.image`treeImage`)
    myTree.vx = randint(-50, 50)
    // scene.cameraFollowSprite(myTree)
    obstacle.detectObstacle(player, 2, 2, myTree)
}) 
const obstacle = obstacles.createObstacle(player, 1, 1)
controller.moveSprite(player) 
scene.cameraFollowSprite(player)
let invisiblecollision = sprites.create(assets.image`invisibleCollision1`)
invisiblecollision.setPosition(screen.width / 4, 60)
invisiblecollision.setFlag(SpriteFlag.Invisible, true)
obstacle.detectObstacle(player, 10, 0, invisiblecollision)
let invisiblecollision2 = sprites.create(assets.image`invisibleCollision2`)
invisiblecollision2.setPosition(80, screen.height * 2 - 120)
invisiblecollision2.setFlag(SpriteFlag.Invisible, true)
// invisiblecollision2.setFlag(SpriteFlag.RelativeToCamera, true)
invisiblecollision2.setFlag(SpriteFlag.StayInScreen, true)
obstacle.detectObstacle(player, 0, 10, invisiblecollision2)
// player.follow(invisiblecollision2)        
let yourSprite: Sprite = null 
yourSprite = sprites.create(assets.image`enemyInvisible`, SpriteKind.Enemy)


forever(() => {
    if(player.y < config.DISPLAY_HEIGHT / 4) {
        player.y += 5
    }
}) 

game.onUpdate(() => {
    info.changeScoreBy(control.timer1.seconds())
})

game.onUpdateInterval(randint(2000, 4000), () => {
   setTimeout(() => {
        yourSprite = sprites.create(assets.image`yourSpriteImage`, SpriteKind.Enemy)
       yourSprite.setPosition(player.x + 40, player.y)
       yourSprite.vx = -randint(5, 10)
   }, 2000)
}) 
 
game.onUpdate(() => {
    player.sayText("enemy spawning at " + yourSprite.x + yourSprite.y, 500, false)
})

game.onUpdate(() => {
    yourSprite.sayText("player is at" + player.x + player.y, 500, false)
})
 let shot = false
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, (sprite: Sprite, otherSprite: Sprite) => {
   if(shot) {
       sprites.destroy(otherSprite)
   } else { 
       pause(1000)
       info.changeLifeBy(-1)
       sprite.say("you have" + " " + info.life() + " left", 1000)
   }
}) 

info.onLifeZero(() => {
    game.showLongText("your previous seconds of survival is " + info.score() + " and saved data for position is " + player.x + player.y, DialogLayout.Center)
    pauseUntil(() => controller.A.isPressed())
    control.reset()
}) 
 
// tell the user why the seconds can be underfined 
game.showLongText("How to play this game, avoid the ducks and the trees are collision obstacle hitboxes that can make you block to hit other side because it has hitboxes bumping to you, good luck.", DialogLayout.Center)
controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    shot = true
    animation.runImageAnimation(player, assets.animation`attackAnim`, 100, false)
    if (player.overlapsWith(yourSprite)) {
        sprites.destroy(yourSprite)
    }
    pause(700)
    shot = false
})
