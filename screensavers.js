//Initialize boolean to track working vs. sleep modes
let asleep: boolean = false

//When the A button is pressed and held for 2 seconds, sleeps
input.onButtonPressed(Button.A, function () {
    basic.pause(2000)
    if (input.buttonIsPressed(Button.A)) asleep = true
})

//Changes mode to working
input.onButtonPressed(Button.B, function () {
    asleep = false
})

basic.forever(function () {
    if (!asleep) {
        basic.showString("Test")
    }
})
