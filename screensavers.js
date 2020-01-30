//Initialize boolean to track working vs. sleep modes
let asleep: boolean = false

//When the A button is pressed and held for 2 seconds, sleeps
input.onButtonPressed(Button.A, function () {
    /*basic.pause(2000)
    if (input.buttonIsPressed(Button.A))*/ asleep = true
})

//Changes mode to working
input.onButtonPressed(Button.B, function () {
    asleep = false
})
/*
class screensaver {
    constructor() {
    }
}*/

//Nodes for linked list
class dropNode {
    drop: game.LedSprite
    nextDrop: dropNode
    constructor() {
        //Create new sprite at random led on top of the screen
        this.drop = game.createSprite(Math.randomRange(0, 4), 0)
        //Reference to the next element
        this.nextDrop = null
    }
}

class droplets {
    head: dropNode
    constructor() {
        this.head = null
    }
    addDrop() {
        const newDrop = new dropNode()
        //Instantiate the head of linked list on first run
        if (this.head == null) {
            this.head = newDrop
        } else {
            //Iterate through list
            let current = this.head
            while (current.nextDrop) {
                current = current.nextDrop
            }
            //Add new element at the end
            current.nextDrop = newDrop
        }
    }
    fall() {
        //When a drop reaches the end of screen, delete sprite and move head to next element
        if (this.head.drop.get(LedSpriteProperty.Y) == 4) {
            this.head.drop.delete()
            this.head = this.head.nextDrop
        }
        //Iterate through linked list, moving drops down the screen
        let current = this.head
        while (current.nextDrop) {
            current.drop.changeYBy(1)
            current = current.nextDrop
        }
    }
}

basic.forever(function () {
    if (!asleep) {
        //maybe a binary calculator or simple game
        game.pause()
        basic.showString("A")
    } else {
        game.resume()
        input.onGesture(Gesture.Shake, function () {
            let rain = new droplets()
            //loop to create new rain drops and have them fall continuously
            while (true) {
                rain.addDrop()
                basic.pause(100)
                rain.fall()
            }
        })
    }
})
