/**
* ChristmasWreath Ring
* @category: Digital Art
* @purpose: add LED support to WS2812 LED strip for micro bit
* @author: Tiebusa
* @version: 1.0.5
*/

enum LEDMode {
    //% block="Ring Mode"
    Ring = 0,
    //% block="Dolphin Mode"
    Dolphin = 1,
    //% block="Fade Mode"
    Fade = 2,
    //% block="Bubble Mode"
    Bubble = 3,
    //% block="Free Mode"
    Free = 4
}

enum Level {
    //% block="Level 1"
    Level_1 = 0,
    //% block="Level 2"
    Level_2 = 1,
    //% block="Level 3"
    Level_3 = 2,
    //% block="Level 4"
    Level_4 = 3,
    //% block="Level 5"
    Level_5 = 4,
    //% block="Level 6"
    Level_6 = 5,
    //% block="Level 7"
    Level_7 = 6,
    //% block="Level 6"
    Level_8 = 7,
    //% block="Level 9"
    Level_9 = 8,
    //% block="Level 10"
    Level_10 = 9,
    //% block="Level 11"
    Level_11 = 10,
    //% block="Level 12"
    Level_12 = 11,
    //% block="Level 13"
    Level_13 = 12,
    //% block="Level 14"
    Level_14 = 13,
    //% block="Level 15"
    Level_15 = 14
}

/**
* ChristmasWreath Ring blocks
*/
//% weight=100 color=#00590d icon="֍"
namespace ChristmasWreath {
    /**
     * A ChristmasWreath ring
     */

    class RGBVector3 {
        public r: number;
        public g: number;
        public b: number;

        constructor(r: number, g: number, b: number) {
            this.r = r;
            this.g = g;
            this.b = b;
        }
    }

    export class ChristmasWreath {
        mode: LEDMode;
        strip: neopixel.Strip;
        //numOfLEDs: number;
        totalNumLeds: number;
        totalNumLevel: number;
        numOfLEDPerPillar: number;

        private _colorStep: number;

        private _lastMicVal: number;
        private _colorOffset: number;

        ringSpeed: number;
        private _isSetupRing: boolean;
        private _defaultMicThreshold: number;


        private _fadeT: number;
        private _fadeDir: number;
        private _fadeColorOffset: number;

        private _bubbleDuration: number;
        private _bubbleState: number[];
        private _bubbleColor: number[];

        private _colorList: number[];
        private _hasAppliedCustomColor: boolean;

        public updateVars(): void {
            this._colorStep = 360 / this.numOfLEDPerPillar;
            this._colorOffset = 0;
            this._lastMicVal = -1;
            this._fadeT = 0;
            this._fadeDir = 1;
            this._fadeColorOffset = 0;

            this._bubbleState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this._bubbleColor = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this._bubbleDuration = 3;
            this._defaultMicThreshold = 50;
            this._hasAppliedCustomColor = false;

        }

        /**
         * Clear strip led color
         */
        //% blockId="christmaswreath_clearStrip" block="%wreath clear led color"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        //% advanced=true
        public clearStrip(): void {
            this.strip.clear();
        }

        /**
         * Show strip led color. Any change in memory needed call this function to display on LED strip.
         */
        //% blockId="christmaswreath_showStrip" block="%wreath show led color"
        //% wreath.defl=wreath
        //% weight=80 blockGap=8
        //% parts="christmaswreath"
        public showStrip(): void {
            this.strip.show();
        }


        /**
         * Set microphone threshold to trigger bubble animation.
         * @param mic range from 0 to 255, for quiet area about 50, eg: 50,100,128
         */
        //% blockId="christmaswreath_setMicThreshold" block="%wreath|set mic threshold to %mic"
        //% wreath.defl=wreath
        //% weight=85 blockGap=8
        //% parts="christmaswreath"
        //% advanced=true
        public setMicThreshold(mic: number = 50): void {
            if (mic >= 0 && mic <= 255) {
                this._defaultMicThreshold = mic;
            } else {
                this._defaultMicThreshold = 50;
            }
        }

        /**
         * Change Mode.
         */
        //% blockId="christmaswreath_changeMode" block="%wreath|change mode to %mode"
        //% wreath.defl=wreath
        //% weight=85 blockGap=8
        //% parts="christmaswreath"
        public changeMode(m: LEDMode): void {
            this._isSetupRing = false;
            this.mode = m;
        }

        /**
         * Get current mode.
         */
        //% blockId="christmaswreath_getMode" block="%wreath|get current mode"
        //% wreath.defl=wreath
        //% weight=70 blockGap=8
        //% parts="christmaswreath"
        //% advanced=true
        public getMode(): LEDMode {
            return this.mode;
        }

        /**
         * Rotate a pixel pattern among the LED strip.
         */
        //% blockId="christmaswreath_rotatePixelColor" block="%wreath|rotate pixel by %mode|pixel"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        //% advanced=true
        public rotatePixelColor(speed: number): void {
            this.ringSpeed = speed;
            if (this.ringSpeed > 5) {
                this.ringSpeed = 5;
            }
            if (this.ringSpeed < -5) {
                this.ringSpeed = -5;
            }
            this.strip.rotate(this.ringSpeed);
        }

        /**
         * Play next animation
         */
        //% blockId="christmaswreath_nextMode" block="%wreath play next mode"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public nextMode(): void {
            this._isSetupRing = false;
            this.mode += 1;
            if (this.mode >= 4) {
                this.mode = 0;
            }
        }

        /**
         * Play previous animation
         */
        //% blockId="christmaswreath_previousMode" block="%wreath play previous mode"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public previousMode(): void {
            this._isSetupRing = false;
            this.mode -= 1;
            if (this.mode <= 0) {
                this.mode = 3;
            }
        }

        /**
         * Update animation
         */
        //% blockId="christmaswreath_update" block="%wreath update lighting animation"
        //% wreath.defl=wreath
        //% weight=75 blockGap=8
        //% parts="christmaswreath"
        public update(): void {
            if (this.mode == LEDMode.Ring) {
                this.ringAnimation(this.ringSpeed);
                this.showStrip();
                basic.pause(100);
            } else if (this.mode == LEDMode.Dolphin) {
                this.dolphinAnimation(this.ringSpeed);
                this.showStrip();
                basic.pause(100);
            } else if (this.mode == LEDMode.Fade) {
                this.fadeAnimation();
                this.showStrip();
            } else if (this.mode == LEDMode.Bubble) {
                let mic = 128
                try {
                    mic = input.soundLevel()
                } catch (err) {
                    mic = 128
                }
                this.bubbleAnimation(mic, this._defaultMicThreshold)
                this.showStrip();
            } else {
                this.showStrip();
            }

            //else if (this.mode == LEDMode.Equalizer) {
            //    let mic = 128
            //    try {
            //        mic = input.soundLevel()
            //    } catch (err) {
            //        mic = 128
            //    }
            //    this.equalizerAnimation(mic);
            //    this.showStrip();
            //    basic.pause(1);
            //}

            this._colorOffset += 1;
            this._fadeColorOffset += 1;
            this._fadeT += 1;

            if (this._colorOffset > 360) {
                this._colorOffset = 0;
            }
            if (this._fadeT > 100) {
                this._fadeT = 1;
            }
        }

        private lerp(x: number, y: number, a: number) {
            return (1 - a) * x + a * y;
        }

        private applyDolphinPattern() {
            if (!this._colorList) {
                this._colorList = [0x2989cc, 0x1a51ed, 0x4fffc7, 0x8affa0];
            }

            if (this._colorList.length == 1) {
                this._colorList[1] = 0;
                this._colorList[2] = 0;
                this._colorList[3] = 0;
            } else if (this._colorList.length == 2) {
                this._colorList[2] = 0;
                this._colorList[3] = 0;
            } else if (this._colorList.length == 3) {
                this._colorList[3] = 0;
            }

            let colorArray = [];
            for (let i = 0; i < this._colorList.length; i++) {
                let _r = (this._colorList[i] >> 16) & 255;
                let _g = (this._colorList[i] >> 8) & 255;
                let _b = this._colorList[i] & 255;
                colorArray[i] = {
                    r: _r,
                    g: _g,
                    b: _b,
                }
            }
            let stripPixelIndex = 0;
            if (colorArray.length <= 1) {
                console.log('Error!');
            }
            let num_step = Math.floor(this.totalNumLeds / (colorArray.length));
            let small_step = 1 / num_step;

            for (let index = 0; index < colorArray.length; index++) {
                let r = colorArray[index].r;
                let g = colorArray[index].g;
                let b = colorArray[index].b;

                for (let jj = 1; jj <= num_step; jj++) {
                    let amount = small_step * jj;
                    let r_0 = r;
                    let g_0 = g;
                    let b_0 = b;

                    if (amount > 0.6) {
                        r_0 = g_0 = b_0 = 0;
                    }

                    console.log((stripPixelIndex) + 'rgb(' + r_0 + "," + g_0 + "," + b_0 + ")");
                    this.strip.setPixelColor(stripPixelIndex, neopixel.rgb(r_0, g_0, b_0));
                    stripPixelIndex++;
                }

            }
            for (; stripPixelIndex < this.totalNumLeds; stripPixelIndex++) {
                let r_0 = 0;
                let g_0 = 0;
                let b_0 = 0;
                this.strip.setPixelColor(stripPixelIndex, neopixel.rgb(r_0, g_0, b_0));

                console.log((stripPixelIndex) + 'rgb(' + r_0 + "," + g_0 + "," + b_0 + ")");
            }
        }

        private applyColorPattern() {
            if (!this._colorList) {
                this._colorList = [0xFF8522, 0xf00513, 0x30ba2c];
            }
            //console.log(1);
            if (this._colorList.length == 0) {
                this._colorList = [0xFF8522,
                    0xf00513,
                    0x30ba2c];
                //console.log(2);
            }
            if (this._colorList.length == 1) {
                this._colorList[1] = this._colorList[0];
            }
            let colorArray = [];
            for (let i = 0; i < this._colorList.length; i++) {
                let _r = (this._colorList[i] >> 16) & 255;
                let _g = (this._colorList[i] >> 8) & 255;
                let _b = this._colorList[i] & 255;
                colorArray[i] = {
                    r: _r,
                    g: _g,
                    b: _b,
                }

                //console.log(colorArray[i]);
            }

            let stripPixelIndex = 0;
            if (colorArray.length <= 1) {
                console.log('Error!');
            }

            //console.log("=====================================" + (colorArray.length - 1));
            let num_step = Math.floor(this.totalNumLeds / (colorArray.length - 1));

            //console.log("num_step=" + (num_step));

            let small_step = 1 / num_step;
            //console.log("small_step=" + (small_step));

            for (let index = 0; index < colorArray.length - 1; index++) {
                let r = colorArray[index].r;
                let g = colorArray[index].g;
                let b = colorArray[index].b;

                let rD = colorArray[index + 1].r;
                let gD = colorArray[index + 1].g;
                let bD = colorArray[index + 1].b;

                for (let jj = 1; jj <= num_step; jj++) {
                    let amount = small_step * jj;
                    let r_0 = Math.round(this.lerp(r, rD, amount));
                    let g_0 = Math.round(this.lerp(g, gD, amount));
                    let b_0 = Math.round(this.lerp(b, bD, amount));

                    //console.log((stripPixelIndex) + 'rgb(' + r_0 + "," + g_0 + "," + b_0 + ")");
                    this.strip.setPixelColor(stripPixelIndex, neopixel.rgb(r_0, g_0, b_0));
                    stripPixelIndex++;
                }

            }
            for (; stripPixelIndex < this.totalNumLeds; stripPixelIndex++) {
                let r_0 = colorArray[colorArray.length - 1].r;
                let g_0 = colorArray[colorArray.length - 1].g;
                let b_0 = colorArray[colorArray.length - 1].b;
                this.strip.setPixelColor(stripPixelIndex, neopixel.rgb(r_0, g_0, b_0));

                //console.log((stripPixelIndex) + 'rgb(' + r_0 + "," + g_0 + "," + b_0 + ")");
            }
        }

        /**
         * Set color pattern list
        * (0, 1, 2, 3, etc...)
        */
        //% blockId="christmaswreath_setColorPattern" block="%wreath|set color pattern to %colorList to "
        //% wreath.defl=wreath
        //% weight=80 blockGap=8
        //% parts="christmaswreath"
        public setColorPattern(colorList: number[]): void {
            //this._colorList = colorList;
            if (this.mode == LEDMode.Dolphin) {
                this._colorList = [];
                for (let j = 0; j < colorList.length && j < 4; j++) {
                    this._colorList[j] = colorList[j];
                }
                console.log("colorList.length = " + this._colorList.length);

                this.applyDolphinPattern();
            } else {

                this._colorList = [];
                for (let j = 0; j < colorList.length && j <= this.totalNumLeds - 1; j++) {
                    this._colorList[j] = colorList[j];
                }
                console.log("colorList.length = " + this._colorList.length);

                this.applyColorPattern();
            }

            this._hasAppliedCustomColor = true;
        }

        /**
         * Set leds strip to rainbow pattern.
         */
        //% blockId="christmaswreath_showRing" block="%wreath|set to rainbow pattern"
        //% wreath.defl=wreath
        //% weight=80 blockGap=8
        //% parts="christmaswreath"
        private showRainbow(): void {
            this.strip.showRainbow();
        }

        /**
         * Play ring animation
         */
        //% blockId="christmaswreath_ringAnimation" block="%wreath play ring animation width speed%speed"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public ringAnimation(speed: number): void {
            this.ringSpeed = speed;
            if (this._isSetupRing == false || this._isSetupRing == null) {
                this._isSetupRing = true;
                this.strip.clear();
                //this.strip.showRing(1, 360);

                this.applyColorPattern();
            }
            this.rotatePixelColor(this.ringSpeed)
        }

        /**
         * Play dolphin animation
         */
        //% blockId="christmaswreath_dolphinAnimation" block="%wreath play dolphin animation width speed%speed"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public dolphinAnimation(speed: number): void {
            //console.log('dolphinAnimation() s')
            this.ringSpeed = speed;
            if (this._isSetupRing == false || this._isSetupRing == null) {
                this._isSetupRing = true;
                this.strip.clear();
                //this.strip.showRing(1, 360);				

                console.log('applyDefaultDolphinPattern() s')
                this.applyDolphinPattern();
            }
            this.rotatePixelColor(this.ringSpeed)
        }


        /**
         * Play equalizer animation
         */
        //% blockId="christmaswreath_equalizerAnimation" block="%wreath play equalizer animation with sound level%value"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        private equalizerAnimation(micVal: number): void {
            if (this._lastMicVal != -1) {
                if (micVal < this._lastMicVal) {
                    micVal = micVal + ((this._lastMicVal - micVal) * 0.2)
                } else {
                    micVal = this._lastMicVal + ((micVal - this._lastMicVal) * 0.95)
                }
            }
            this._lastMicVal = micVal;
            let anchor: number = micVal / 100 * this.numOfLEDPerPillar

            this.strip.clear()
            for (let idx = 0; idx <= this.numOfLEDPerPillar; idx++) {
                let _color = idx * this._colorStep + this._colorOffset % 360
                if (idx <= anchor) {
                    this.setLevelColor(idx, this.makeColor(_color, 100, 50))
                } else {
                    let _saturation: number = (45 - 5) * ((this.numOfLEDPerPillar - idx) / (this.numOfLEDPerPillar - anchor)) * 0.6
                    let _brightness: number = (100 - 40) * ((this.numOfLEDPerPillar - idx) / (this.numOfLEDPerPillar - anchor)) * 1
                    if (_saturation < 5) {
                        _saturation = 5
                    }
                    this.setLevelColor(idx, this.makeColor(_color, _saturation, _brightness))
                }
            }
        }

        /**
         * Play fade animation
         */
        //% blockId="christmaswreath_fadeAnimation" block="%wreath play fade animation"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public fadeAnimation() {
            if (this._fadeT % 100 == 0) {
                this._fadeDir *= -1;
            }
            let fadeB = 0;
            if (this._fadeDir == 1) {
                fadeB = this.easeInOutQuad(this._fadeT % 100, 0, 100, 100)
            } else {
                fadeB = 100 - this.easeInOutQuad(this._fadeT % 100, 0, 100, 100)
            }

            this.strip.clear()
            for (let index2 = 0; index2 < this.numOfLEDPerPillar; index2++) {
                let color = this.makeColor((this._fadeColorOffset / 7 + (60 / this.numOfLEDPerPillar * index2)) % 360, 100, fadeB * 0.45 + 5)
                this.setLevelColor(index2, color)
            }

        }

        /**
         * Play bubble animation
         */
        //% blockId="christmaswreath_bubbleAnimation" block="%wreath play bubble animation with sound level%micVale and trigger threshold%threshold"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public bubbleAnimation(micVal: Number, threshold: Number): void {
            let _duration = 3
            if (micVal > threshold) {
                this.triggerBubble(_duration)
            }
            this.moveBubble()
        }



        /**
         * Trigger bubble led effect
         */
        //% blockId="christmaswreath_triggerBubbleWithColor" block="%wreath trigger bubble led effect with %duration|duration and %color|color"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public triggerBubbleWithColor(duration: number, color: number): void {
            this._bubbleDuration = duration
            let _duration2 = this._bubbleDuration
            this._bubbleState[0] = this._bubbleState[1] = _duration2
            this._bubbleColor[0] = this._bubbleColor[1] = this.makeColor(color, 100, 50)
        }


        /**
         * Trigger bubble led effect
         */
        //% blockId="christmaswreath_triggerBubble" block="%wreath trigger bubble led effect with %duration|duration"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public triggerBubble(duration: number): void {
            this._bubbleDuration = duration
            let _duration3 = this._bubbleDuration
            this._bubbleState[0] = this._bubbleState[1] = _duration3;

            if (this._hasAppliedCustomColor && this._colorList.length >= 1) {
                let randId = Math.floor(Math.random() * this._colorList.length);
                this._bubbleColor[0] = this._bubbleColor[1] = this._colorList[randId];

                console.log(this._colorList[randId])
            } else {
                this._bubbleColor[0] = this._bubbleColor[1] = this.makeColor(Math.random() * 360, 100, 50)
            }
        }

        /**
         * Move bubble led move upward
         */
        //% blockId="christmaswreath_moveBubble" block="%wreath move bubble led upward"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public moveBubble(): void {
            let _duration4 = this._bubbleDuration
            this.strip.clear()

            for (let level = 0; level < this.numOfLEDPerPillar; level++) {
                if (this._bubbleState[level] > 0) {
                    this.setLevelColor(level, this._bubbleColor[level])
                    this._bubbleState[level] -= 1;
                    if (this._bubbleState[level] == 0 && level + 1 < this.numOfLEDPerPillar) {
                        this._bubbleState[level + 1] = _duration4 + 1;
                        this._bubbleColor[level + 1] = this._bubbleColor[level]
                    }
                } else {
                    this.setLevelColor(level, this.makeColor(30, 25, 10))
                }
            }
        }

        /**
         * make color by HSB
         */
        private makeColor(color: number, saturation: number, brightness: number): number {
            return neopixel.hsl(color, saturation, brightness)
        }

        /**
         * Set christmas wreath color
         */
        //% blockId="christmaswreath_setRingColor" block="%wreath set christmas wreath led color to %color=neopixel_colors"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public setRingColor(color: number): void {
            for (let idx = 0; idx <= this.totalNumLevel; idx++) {
                this.setLevelColor(idx, color)
            }
        }

        /**
         * Set christmas wreath brightness
         * value larger than 50 color will change to white
         */
        //% blockId="christmaswreath_setRingColorAndBrightness" block="%wreath set christmas wreath color to %color=christmaswreath_pickColorHue and led brightness to %brightness"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public setRingColorAndBrightness(color: number, brightness: number): void {
            for (let idx = 0; idx <= this.totalNumLevel; idx++) {
                this.setLevelColor(idx, neopixel.hsl(color, 100, brightness))
            }
        }

        /**
         * Set christmas wreath brightness
         * Set specfic level to different color and brightness
         * (0 = level-1, 1 = level-2, etc...)
         */
        //% blockId="christmaswreath_setLevelColorAndBrightness" block="%wreath set level-%level=christmaswreath_levels color to %color=christmaswreath_pickColorHue and led brightness to %brightness"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public setLevelColorAndBrightness(level: number, color: number, brightness: number): void {
            this.setLevelColor(level, neopixel.hsl(color, 100, brightness))
        }

        /**
         * Set specfic level to different color
         * (0 = level-1, 1 = level-2, etc...)
         */
        //% blockId="christmaswreath_setLevelColor" block="%wreath set level-%level=christmaswreath_levels led to %color=neopixel_colors"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public setLevelColor(level: number, color: number): void {
            this.strip.setPixelColor(level, color)
            this.strip.setPixelColor(this.totalNumLeds - level - 1, color)
            //this.strip.setPixelColor(39 - level, color)
            //this.strip.setPixelColor(level + 41, color)
            //this.strip.setPixelColor(81 - level, color)

            //if(level==this.numOfLEDPerPillar-1){
            //    this.strip.setPixelColor(19, color)
            //    this.strip.setPixelColor(20, color)
            //    this.strip.setPixelColor(60, color)
            //    this.strip.setPixelColor(61, color)
            //    this.strip.setPixelColor(62, color)
            //}
        }

        /**
         * Set pixel color
         * (0 = index-1, 1 = index-2, etc...)
         */
        //% blockId="christmaswreath_setPixelColor" block="%wreath set pixel-%index led to %color=neopixel_colors"
        //% wreath.defl=wreath
        //% weight=50 blockGap=8
        //% parts="christmaswreath"
        public setPixelColor(index: number, color: number): void {
            this.strip.setPixelColor(index, color)
        }

        public easeInOutQuad(_percent: number, _elapsed: number, _start: number, _end: number) {
            _percent /= _end / 2;

            if (_percent < 1) {
                return _start / 2 * _percent * _percent + _elapsed
            }
            _percent += -1
            return (0 - _start) / 2 * (_percent * (_percent - 2) - 1) + _elapsed
        }
    }
    /**
      * Create a new Christmas Wreath controller.
      * @param mode the default mode where the Christmas wreath default setting.
      */
    //% blockId="christmaswreath_create" block="Create christmas wreath"
    //% weight=90 blockGap=8
    //% parts="christmaswreath"
    //% trackArgs=0,1
    //% blockSetVariable=wreath
    export function create(): ChristmasWreath {
        let wreath = new ChristmasWreath();
        wreath.mode = LEDMode.Ring;
        wreath.numOfLEDPerPillar = 15;
        wreath.totalNumLeds = 30;
        wreath.totalNumLevel = 15;
        wreath.strip = neopixel.create(DigitalPin.P2, wreath.totalNumLeds, NeoPixelMode.RGB);
        wreath.ringSpeed = 1;

        wreath.updateVars();
        return wreath;
    }

    /**
     * Gets the level value of a known levels
    */
    //% weight=2 blockGap=8
    //% blockId="christmaswreath_levels" block="%level"
    //% advanced=true
    export function levels(_level: Level): number {
        return _level;
    }

    /**
     * Gets red, green, blue channels into a RGB color
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% weight=2 blockGap=8
    //% blockId="christmaswreath_pickRgbColors" block="red %red|green %green|blue %blue"
    //% red.min=0 red.max= 255 red.defl=0
    //% green.min=0 green.max= 255 green.defl=0
    //% blue.min=0 blue.max= 255 blue.defl=0
    export function rgbColor(red: number, green: number, blue: number): number {
        return neopixel.rgb(red, green, blue);
    }

    /**
     * Gets Color Hue
    */
    //% weight=2 blockGap=8
    //% blockId="christmaswreath_pickColorHue" block="Hue $color"
    //% color.shadow="colorWheelHsvPicker"
    export function hueColor(color: number): number {
        let color2 = ((color / 255 * 360) << 16) + (100 << 8) + (50);
        return color2;
    }

    /**
     * Gets Gradient Color
    */
    //% weight=2 blockGap=8
    //% block="Color Wheel $color"
    //% color.shadow="colorWheelPicker"
    //% advanced=false
    export function showColorWheel(color: number): number {

        let colorWheel = [
            { r: 0, g: 255, b: 255 },
            { r: 60, g: 195, b: 255 },
            { r: 120, g: 135, b: 255 },
            { r: 180, g: 75, b: 255 },
            { r: 240, g: 15, b: 255 },
            { r: 255, g: 45, b: 210 },
            { r: 255, g: 105, b: 150 },
            { r: 255, g: 165, b: 90 },
            { r: 255, g: 225, b: 30 },
            { r: 225, g: 255, b: 30 },
            { r: 165, g: 255, b: 90 },
            { r: 105, g: 255, b: 150 },
            { r: 45, g: 255, b: 210 }
        ];

        let lerp = function (start: number, end: number, amt: number): number {
            return (1 - amt) * start + amt * end
        }
        color = color >> 0;
        color = (color > 255) ? 255 : color;
        let _percent = color / 256;
        let b_index = Math.floor(_percent * colorWheel.length);
        let e_index = b_index + 1;
        e_index = (e_index > colorWheel.length - 1) ? colorWheel.length - 1 : e_index

        let start = { r: colorWheel[b_index].r, g: colorWheel[b_index].g, b: colorWheel[b_index].b }
        let end = { r: colorWheel[e_index].r, g: colorWheel[e_index].g, b: colorWheel[e_index].b }
        let u = _percent * colorWheel.length - 1.
        u = u - Math.floor(u);

        let s = Math.round(lerp(start.r, end.r, u));
        let h = Math.round(lerp(start.g, end.g, u));
        let c = Math.round(lerp(start.b, end.b, u));
        let colorname = 'rgb(' + s + ',' + h + ',' + c + ')';
        console.log(colorname);

        let fullColorHex = function (r: number, g: number, b: number): number {
            return ((r << 16) + (g << 8) + b);
        }
        let colorInDecimal = fullColorHex(s, h, c);
        return colorInDecimal;
    }

}
