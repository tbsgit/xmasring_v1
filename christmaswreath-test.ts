{
    input.onLogoEvent(TouchButtonEvent.Touched, function () {
        wreath.nextMode();
        mode = wreath.getMode();
        basic.showNumber(mode)
    })

    let wreath: ChristmasWreath.ChristmasWreath = null
    basic.showLeds(`
    # # # # #
    # . # . #
    . . # . .
    . . # . .
    . # # # .
    `)
    wreath = ChristmasWreath.create()
    wreath.changeMode(LEDMode.Bubble);
    wreath.setColorPattern([ChristmasWreath.rgbColor(255, 100, 0), ChristmasWreath.rgbColor(255, 0, 255), ChristmasWreath.rgbColor(1, 100, 47)])

    let mode = wreath.getMode();
    wreath.setMicThreshold(60);

    basic.forever(function () {
        wreath.update()
    })

}