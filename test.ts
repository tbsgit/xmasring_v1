// tests go here; this will not be compiled when this package is used as an extension.
{
    let ring = ChristmasWreath.create();

    let speed = 0
    basic.showLeds(`
		# . . . #
		# . . . #
		. . . . .
		. . . . .
		. . # . .
		`)
    let colorList = [
        ChristmasWreath.showColorWheel(149),
        ChristmasWreath.showColorWheel(129),
        ChristmasWreath.showColorWheel(185),
        ChristmasWreath.showColorWheel(214),
        ChristmasWreath.hueColor(0),
        ChristmasWreath.hueColor(12),
        ChristmasWreath.showColorWheel(120),
        ChristmasWreath.showColorWheel(129),
        ChristmasWreath.showColorWheel(149),
        ChristmasWreath.showColorWheel(185),
        ChristmasWreath.showColorWheel(214),
        ChristmasWreath.hueColor(0),
        ChristmasWreath.hueColor(12),
        ChristmasWreath.showColorWheel(120),
        ChristmasWreath.showColorWheel(149)
    ]
    ring.changeMode(LEDMode.Rainbow)
    ring.showStrip()
    speed = 1
    ring.setColorPattern(colorList)

    basic.forever(function () {
        //ring.update();
        ring.rainbowAnimation(speed)
        // ring.setRingColor(ChristmasWreath.showColorWheel(45))
        // ring.showColor(neopixel.hsl(0, 0, 0))
        ring.showStrip()
    })

    input.onButtonPressed(Button.A, () => {
        ring.previousMode()
    });
    input.onButtonPressed(Button.B, () => {
        ring.nextMode()
    });


    control.inBackground(function () {

    })
}
