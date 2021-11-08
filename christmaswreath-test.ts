{
    input.onButtonPressed(Button.A, function () {
        speed = speed + 1
        ring.showStrip()
    })
    input.onButtonPressed(Button.B, function () {
        speed = speed - 1
        ring.showStrip()
    })
    input.onLogoEvent(TouchButtonEvent.Touched, function () {
        ring.nextMode()
    })
    let speed = 0
    let ring: ChristmasWreath.ChristmasWreath = null
    basic.showLeds(`
    # # # # #
    # . # . #
    . . # . .
    . . # . .
    . # # # .
    `)
    ring = ChristmasWreath.create()
    ring.changeMode(LEDMode.Rainbow)
    ring.setColorPattern([
        ChristmasWreath.rgbColor(255, 0, 0),
        ChristmasWreath.rgbColor(0, 0, 0),
        ChristmasWreath.rgbColor(0, 0, 0),
        ChristmasWreath.showColorWheel(201),
        ChristmasWreath.rgbColor(0, 0, 0),
        ChristmasWreath.rgbColor(0, 0, 0),
        ChristmasWreath.rgbColor(0, 0, 255)
    ])
    ring.showStrip()
    speed = 0
    basic.forever(function () {
        ring.rainbowAnimation(speed)
        ring.showStrip()
    })

}