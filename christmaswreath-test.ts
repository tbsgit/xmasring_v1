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
    . . # . .
    . . # . .
    . . # . .
    . # # # .
    `)
    ring = ChristmasWreath.create()
    ring.changeMode(LEDMode.Dolphin)
    ring.setColorPattern([
        ChristmasWreath.rgbColor(41, 137, 204),
        ChristmasWreath.rgbColor(26, 81, 237),
        ChristmasWreath.rgbColor(79, 255, 199),
        ChristmasWreath.rgbColor(138, 255, 160)
    ])
    ring.showStrip()
    speed = 0
    basic.forever(function () {
        ring.dolphinAnimation(speed)
        ring.showStrip();
        basic.pause(100)
    })

}