let scrSel = 0      //screensaver selection
let asleep = false  //sleep state

let difficulty: number = 500
class snake {
    path: number[] = []
    tail: game.LedSprite[] = []
    food: game.LedSprite
    tailLength: number
    foodX: number
    foodY: number
    constructor() {
        this.path[0, 0] = Math.randomRange(0, 4)
        this.path[0, 1] = Math.randomRange(0, 4)
        this.path[1, 0] = this.path[0, 0] - 1
        this.path[1, 1] = this.path[0, 1]
        this.tailLength = 1
        this.tail[0] = game.createSprite(this.path[0, 0], this.path[0, 1])
        this.tail[1] = game.createSprite(this.path[1, 0], this.path[1, 1])
        this.newFood()
    }
    newFood() {
        this.foodX = Math.randomRange(0, 4)
        this.foodY = Math.randomRange(0, 4)
        for (let i: number = 0; i <= this.tailLength; i++) {
            if (this.foodX == this.path[i, 0] && this.foodY == this.path[i, 1]) this.newFood()
        }
        this.food = game.createSprite(this.foodX, this.foodY)
    }
    edge(): boolean {
        if (this.tail[0].get(LedSpriteProperty.X) == 4 && this.tail[0].get(LedSpriteProperty.Direction) == 90) {
            this.tail[0].setX(0)
            return true
        } else if (this.tail[0].get(LedSpriteProperty.X) == 0 && this.tail[0].get(LedSpriteProperty.Direction) == -90) {
            this.tail[0].setX(4)
            return true
        } else if (this.tail[0].get(LedSpriteProperty.Y) == 4 && this.tail[0].get(LedSpriteProperty.Direction) == 180) {
            this.tail[0].setY(0)
            return true
        } else if (this.tail[0].get(LedSpriteProperty.Y) == 0 && this.tail[0].get(LedSpriteProperty.Direction) == 0) {
            this.tail[0].setY(4)
            return true
        }
        return false
    }
    collision(): boolean {
        for (let i: number = this.tailLength; i >= 2; i--) {
            if (this.tail[0].get(LedSpriteProperty.X) == this.tail[i].get(LedSpriteProperty.X) &&
                this.tail[0].get(LedSpriteProperty.Y) == this.tail[i].get(LedSpriteProperty.Y))
                return true
        }
        return false
    }
    slither() {
        //Checks for edge of screen
        if (this.edge()) {
            basic.pause(difficulty)
        } else {
            this.tail[0].move(1)
            basic.pause(difficulty)
        }
        //updates coordinates of player in array
        //this.path[0, 0] = 
        //this.path[0, 1] = 
        for (let i: number = this.tailLength; i >= 1; i--) {
            this.path[i, 0] = this.tail[i - 1].get(LedSpriteProperty.X)
            this.path[i, 1] = this.tail[i - 1].get(LedSpriteProperty.Y)
            this.tail[i].goTo(this.path[i, 0], this.path[i, 1])
        }

        if (this.collision()) {
            game.gameOver()
        }

        if (this.path[0, 0] == this.foodX && this.path[0, 1] == this.foodY) {
            this.tailLength++
            this.path[this.tailLength, 0] = this.path[this.tailLength - 1, 0]
            this.path[this.tailLength, 1] = this.path[this.tailLength - 1, 1]
            this.tail[this.tailLength] = game.createSprite(this.path[this.tailLength, 0], this.path[this.tailLength, 1])
            this.food.delete()
            game.addScore(1)
            this.newFood()
        }
    }
    turnLeft() {
        this.tail[0].changeDirectionBy(-90)
    }
    turnRight() {
        this.tail[0].changeDirectionBy(90)
    }
}
let sGame = new snake()

// When the A button is pressed and held for 2
// seconds, sleeps
input.onButtonPressed(Button.A, function () {
    /*sGame.turnLeft()
    basic.pause(2000)
    if (input.buttonIsPressed(Button.A))*/
    asleep = true
})
// Changes mode to working
input.onButtonPressed(Button.B, function () {
    if (asleep) {
        asleep = false
    } else {
        sGame.turnRight()
    }

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
    dropX: number
    dropY: number
    dropB: number
    nextDrop: dropNode
    constructor() {
        //Create new sprite at random led on top of the screen
        this.dropX = Math.randomRange(0, 4)
        this.dropY = 0
        this.dropB = Math.randomRange(100, 255)
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
            led.plotBrightness(this.head.dropX, this.head.dropY, this.head.dropB)
        } else {
            //Iterate through list
            let current = this.head
            while (current.nextDrop) {
                current = current.nextDrop
            }
            //Add new element at the end
            current.nextDrop = newDrop
            led.plotBrightness(current.nextDrop.dropX, current.nextDrop.dropY, current.nextDrop.dropB)
        }
    }
    fall() {
        //When a drop reaches the end of screen, delete sprite and move head to next element
        while (this.head.dropY == 4) {
            led.unplot(this.head.dropX, this.head.dropY)
            this.head = this.head.nextDrop
        }
        //Iterate through linked list, moving drops down the screen
        let current = this.head
        while (current.nextDrop) {
            led.unplot(current.dropX, current.dropY)
            current.dropY++
            led.plotBrightness(current.dropX, current.dropY, current.dropB)
            current = current.nextDrop
        }
    }
    delSprites() {
        let current = this.head
        while (current.nextDrop) {
            current = current.nextDrop
        }
        this.head = null
    }
}

function rain() {
    let rain = new droplets()
    let dropNum: number
    while (asleep && scrSel == 0) {
        dropNum = Math.randomRange(1, 3)
        for (let index = 0; index < dropNum; index++) {
            rain.addDrop()
        }
        basic.pause(100)
        rain.fall()
    }
    if (scrSel != 0) {
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
        while (!full()) {
            for (let i: number = 0; i < 4; i++)
                led.plot(Math.randomRange(0, 4), Math.randomRange(0, 4))
            basic.pause(50)
        }
    } else {
        while (!empty()) {
            for (let i: number = 0; i < 4; i++)
                led.unplot(Math.randomRange(0, 4), Math.randomRange(0, 4))
            basic.pause(50)
        }
    }
    basic.pause(200)
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
        game.resume()
        sGame.slither()
        if (asleep) game.pause()
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
