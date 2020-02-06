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

/*class fillOpts {
    constructor () {}
    fill (cycle: number, coordinates: number, pTime: number) {
        for (let i = 0; i < )
    }
}*/

function fillRand(fill: boolean) {
    if (fill) {
        for (let i: number = 0; i < 4; i++) led.plot(Math.randomRange(0, 4), Math.randomRange(0, 4))
        basic.pause(10)
    } else {
        for (let i: number = 0; i < 4; i++) led.unplot(Math.randomRange(0, 4), Math.randomRange(0, 4))
        basic.pause(10)
    }
}

function fillLines(fill: boolean) {
    if (fill) {
        for (let i: number = 0; i < 5; i++) {
            for (let j: number = 0; j < 5; j++) {
                if (j % 2 == 0) {
                    led.plot(i, j)
                } else {
                    led.plot(4 - i, j)
                }
            }
            basic.pause(250)
        }
    } else {
        for (let i: number = 0; i < 5; i++) {
            for (let j: number = 0; j < 5; j++) {
                if (j % 2 == 0) {
                    led.unplot(i, j)
                } else {
                    led.unplot(4 - i, j)
                }
            }
            basic.pause(250)
        }
    }
}

function fillSquares(fill: boolean) {
    if (fill) {
        for (let i: number = 0; i < 5; i++) {
            for (let j: number = 0; j < 5 - i; j++) {
                led.plot(i, j)
                led.plot(j, i)
                led.plot(4 - i, j)
                led.plot(j, 4 - i)
            }
            basic.pause(250)
        }
    } else {
        for (let i: number = 0; i < 5; i++) {
            for (let j: number = 0; j < 5 - i; j++) {
                led.unplot(i, j)
                led.unplot(j, i)
                led.unplot(4 - i, j)
                led.unplot(j, 4 - i)
            }
            basic.pause(250)
        }
    }
}

function fillSweep(fill: boolean) {
    if (fill) {
        for (let i: number = 0; i < 5; i++) led.plot(i, i)
        for (let i: number = 1; i < 5; i++) {
            for (let j: number = 0; j < i; j++) {
                led.plot(j, i)
                led.plot(4 - j, 4 - i)
            }
            basic.pause(250)
        }
    } else {
        for (let i: number = 0; i < 5; i++) led.unplot(i, i)
        for (let i: number = 1; i < 5; i++) {
            for (let j: number = 0; j < i; j++) {
                led.unplot(j, i)
                led.unplot(4 - j, 4 - i)
            }
            basic.pause(250)
        }
    }
}

function full(): boolean {
    for (let i: number = 0; i < 5; i++) {
        for (let j: number = 0; j < 5; j++) {
            if (!led.point(i, j)) return false
        }
    }
    return true
}

function empty(): boolean {
    for (let i: number = 0; i < 5; i++) {
        for (let j: number = 0; j < 5; j++) {
            if (led.point(i, j)) return false
        }
    }
    return true
}

let fillStatus: boolean = false
function fillUnfill() {
    let selection: number = Math.randomRange(0, 3)
    if (!full() && !fillStatus) {
        switch (selection) {
            case 0:
                fillRand(true)
                break;
            case 1:
                fillLines(true)
                break;
            case 2:
                fillSquares(true)
                break;
            case 3:
                fillSweep(true)
                break;
        }
        if (full()) fillStatus = true
    } else {
        switch (selection) {
            case 0:
                fillRand(false)
                break;
            case 1:
                fillLines(false)
                break;
            case 2:
                fillSquares(false)
                break;
            case 3:
                fillSweep(false)
                break;
        }
        if (empty()) fillStatus = false
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
