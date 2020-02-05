let scrSel = 0      //screensaver selection
let asleep = false  //sleep state

// When the A button is pressed and held for 2
// seconds, sleeps
input.onButtonPressed(Button.A, function () {
    // basic.pause(2000) if
    // (input.buttonIsPressed(Button.A))
    asleep = true
})
// Changes mode to working
input.onButtonPressed(Button.B, function () {
    asleep = false
})

input.onGesture(Gesture.Shake, function () {
    scrSel = 0
})

input.onGesture(Gesture.TiltLeft, function () {
    scrSel = 1
})

input.onGesture(Gesture.TiltRight, function () {
    scrSel = 2
})

// Nodes for linked list
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
        //Initialize the head of linked list on first run
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
        while (this.head.drop.get(LedSpriteProperty.Y) == 4) {
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
    delSprites() {
        let current = this.head
        while (current.nextDrop) {
            this.head.drop.delete()
            current = current.nextDrop
        }
        this.head = null
    }
}

function rain() {
    let rain = new droplets()
    let dropNum: number
    game.resume()
    while (asleep && scrSel == 0) {
        dropNum = Math.randomRange(1, 3)
        for (let index = 0; index < dropNum; index++) {
            rain.addDrop()
        }
        basic.pause(100)
        rain.fall()
    }
    if (scrSel != 0) {
        game.pause()
        rain.delSprites()
    }
}

let interval: number = 200
function wave() {
    let wave = images.createBigImage(
        `. . . . . . . . . . . . .
            . . . . . . . # # . . . .
            . . . . . . # # . # . . .
            # . # . # # # # . . . . .
            # # # # # # # # # # # # #`)
    wave.scrollImage(-1, 200)
}

function fillRand(fill: boolean) {
    let init: number[][] =
        [[Math.randomRange(0, 4), Math.randomRange(0, 4)],
        [Math.randomRange(0, 4), Math.randomRange(0, 4)],
        [Math.randomRange(0, 4), Math.randomRange(0, 4)],
        [Math.randomRange(0, 4), Math.randomRange(0, 4)]]
    if (fill) {
        led.plot(init[0][0], init[0][1])
        led.plot(init[1][0], init[1][1])
        led.plot(init[2][0], init[2][1])
        led.plot(init[3][0], init[3][1])
        basic.pause(100)
    } else {
        led.unplot(init[0][0], init[0][1])
        led.unplot(init[1][0], init[1][1])
        led.unplot(init[2][0], init[2][1])
        led.unplot(init[3][0], init[3][1])
        basic.pause(100)
    }
}

function isFull() {
    for (let i: number = 0; i < 5; i++) {
        for (let j: number = 0; j < 5; j++) {
            if (!led.point(i, j)) return false
        }
    }
    return true
}

function fillUnfill() {
    let selection: number = 0
    if (!isFull()) {
        switch (selection) {
            case 0:
                fillRand(true)
                break;
            case 1:
                break;
        }
    } else {
        switch (selection) {
            case 0:
                fillRand(false)
                break;
            case 1:
                break;
        }
    }
}

basic.forever(function () {
    if (!asleep) {
        basic.showIcon(IconNames.SmallHeart)
        if (asleep) basic.clearScreen()
    } else {
        switch (scrSel) {
            case 0:
                rain()
                break;
            case 1:
                wave()
                break;
            case 2:
                fillUnfill()
                break;
        }
    }
})
