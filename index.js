// @flow

const five = require('johnny-five');
const temporal = require('temporal');
const colorConvert = require('color-convert');

// Set time delay in milliseconds.
const delay = 20;
// Starting hue for the LED - turquoise.
const initialHue = 160;

// Boolean to control the color transition loop
let loopActive = false;

// Make a new Johnny-Five board instance.
const board = new five.Board();

board.on('ready', function() {
  console.log('[johnny-five] Board is ready!');

  // Store the RGB LED in a constant.
  // Make sure they are all connected to PWM pins.
  const light = new five.Led.RGB({
    pins: [9, 10, 11],
    // This example uses a Common Anode.
    // Works fine with Common Cathode LEDs!
    isAnode: true,
  });

  // Set the currentHue to the initialHue on startup.
  let currentHue = initialHue;

  /**
   *
   * setLightColor() Function
   *
   * Set the RGB LED to the specific hue passed in the function.
   * Requires conversion from HSL to Hex.
   *
   * @param {Number} hue - the hue to set the LED color.
   */
  const setLightColor = (hue) => {

    /**
     *
     * Store the current hue as a hexadecimal value.
     * Set it to full saturation and medium lightness.
     * Note on lightness: 0 is black, 100 is white. Bear this
     * in mind.
     *
     */
    const hueToHex = colorConvert.hsl.hex(hue, 100, 50);
    // Set RGB LED to current hexidecimal value
    light.color(hueToHex);
  };

  setLightColor(currentHue);

  /**
   *
   * colorLoop() function
   *
   * When fired, loopActive boolean is set to true.
   * Using a temporal loop set to the specified delay, keep looping until
   * the loopActive boolean is set back to false. The loop increments the
   * currentHue variable every 100 milliseconds, and then set the RGB LED color
   * to the new value in currentHue.
   *
   */
  const colorLoop = () => {
    loopActive = true;

    temporal.loop(delay, (loop) => {

      // If the hue has reached 360, set it back to zero
      if (currentHue === 360) {
        currentHue = 0;
      }
      currentHue += 1;

      // Set the LED color to the current hue.
      setLightColor(currentHue);

      // If the loopActive boolean is set to false during a step, stop the loop.
      if (!loopActive) {
        loop.stop();
      }
    });
  };

  /**
   *
   * colorTransition() Function
   *
   * Allows the RGB LED to transition from one hue to another.
   * Depending on the value of the hue, it will transition forward or backwards
   * and do it in steps.
   *
   *
   * @param {Number} hue - the color to change to.
   *
   */
  const colorTransition = (hue) => {
    if (hue !== currentHue) {
      temporal.loop(delay, (loop) => {

        // Check if the new hue is higher or lower than the current one.
        if (hue > currentHue) {
          currentHue += 1;
        } else {
          currentHue -= 1;
        }

        // Set the light color to the hue
        setLightColor(currentHue);

        if (currentHue === hue) {
          loop.stop();
        }
      });
    }
  };

  /**
   *
   * dimTransition() function
   *
   * Instead of changinng through the color wheel, change the colour by
   * fading down the lightness of the light, then when the lightness is at
   * zero, raise the lightness to the new color hue.
   *
   *
   * @param {Number} hue - the color to change to.
   */
  const dimTransition = (hue) => {

    // Store Lightness in a variable
    let lightness = 50; // Not too light, not too dark. Just right.

    // Only run if the hue paramter isn't the current one!
    if (hue !== currentHue) {
      temporal.loop(delay, (loop) => {

        /**
         *
         * If the lightness is at 50 or less, but not at 0,
         * then decrease the lightness.
         * When it's at 0 or more, but less than 50, and the
         * currentHue is set to the new hue, and increase the lightness.
         *
         * In both conditions, convert the respected color and lightness to
         * hexadecimal colors.
         *
         */
        if (hue !== currentHue && lightness <= 50 && lightness > 0) {
          lightness -= 1; // Lower lightness
        } else if (currentHue === hue && lightness >= 0 && lightness < 50) {
          lightness += 1; // Increase lightness
        }

        if (lightness === 0) {
          currentHue = hue; // Set currentHue to the new hue
        }

        const lightnessToHex = colorConvert.hsl.hex(currentHue, 100, lightness);
        light.color(lightnessToHex);

        /**
         *
         * If the current hue matches the new one, and the lightness has
         * reached up to 50 again, stop the loop.
         *
         */
        if (currentHue === hue && lightness === 50) {
          loop.stop();
        }

      });
    }

  };

  /**
   *
   * REPL functions
   *
   * Allows to interact with the created functions for testing.
   * - startLoop() begins the colorLoop() function - this also sets
   * `loopActive` to true.
   * - stopLoop() sets `loopActive` to false, and in turn stops the
   * temporal loop in `colorLoop()`.
   * - changeColor() activates the colorTransition function, from one
   * hue to the next.
   * - dimTransition() activates the `dimTransition()` function, changing
   * the color by fading out and back in.
   *
   */
  this.repl.inject({
    changeColor: (hue) => {
      loopActive = false;
      colorTransition(hue);
    },
    startLoop: () => {
      colorLoop();
    },
    stopLoop: () => {
      loopActive = false;
    },
    dimTransition: (hue) => {
      loopActive = false;
      dimTransition(hue);
    },
  });

  /**
   *
   * Exit Event
   * When disconnecting, make sure components are off.
   *
   */
  this.on('exit', () => {
    // When the board disconnects, turn the LED off.
    light.stop().off();
    console.log('[johnny-five] Board closing - bye bye!');
  });
});
