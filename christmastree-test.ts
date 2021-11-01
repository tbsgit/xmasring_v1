// tests go here; this will not be compiled when this package is used as an extension.
{
    let ring = ChristmasWreath.create();

    input.onButtonPressed(Button.A, () => {
        ring.previousMode()
    });
    input.onButtonPressed(Button.B, () => {
        ring.nextMode()
    });


    basic.forever(function () {
        ring.update();
    })

    control.inBackground(function () {

    })
}
