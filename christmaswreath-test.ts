{
    input.onButtonPressed(Button.A, function () {
        speed = speed + 1
        wreath.showStrip()
    })
    input.onButtonPressed(Button.B, function () {
        speed = speed - 1
        wreath.showStrip()
    })
    input.onLogoEvent(TouchButtonEvent.Touched, function () {
        wreath.nextMode();
        let mode = wreath.getMode();
        basic.showNumber(mode)
    })
    let speed = 0
    let wreath: ChristmasWreath.ChristmasWreath = null
    basic.showLeds(`
    # # # # #
    # . # . #
    . . # . .
    . . # . .
    . # # # .
    `)
    wreath = ChristmasWreath.create()
    wreath.changeMode(LEDMode.Dolphin)
    wreath.setColorPattern([
        ChristmasWreath.rgbColor(41, 137, 204),
        ChristmasWreath.rgbColor(26, 81, 237),
        ChristmasWreath.rgbColor(79, 255, 199),
        ChristmasWreath.rgbColor(138, 255, 160),
        ChristmasWreath.rgbColor(79, 255, 199),
        ChristmasWreath.rgbColor(138, 255, 160)
    ])
    wreath.showStrip()
    speed = 0

    basic.forever(function () {
        //wreath.update()
        wreath.dolphinAnimation(speed)
        //wreath.showStrip();
        //basic.pause(100)
    })

}