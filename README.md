# Smooth RGB LED Colour Transitions with JavaScript

Example code of using smooth RGB LED colour transitions using JavaScript, Johnny-Five, and Temporal. The code uses HSL values to smoothly change the colour of RGB values set to the RGB LED. The full explanation of the code can be found on Hackster.io.

## Installation

When you have downloaded/cloned this project, install dependencies using Yarn or NPM. My preference is Yarn.

```
yarn install
```

## Testing and Typechecking

This project contains ESlint and Flow. To test the code, run `yarn test` and ESlint will check the code for issues, then Flow will do typechecking.

## REPL Commands

When running this nodebot script, the functions written in the code can be accessed using REPL. This is a list of the commands.

- `startLoop()` — This will activate a loop going through hues, making smooth RGB/Rainbow transitions.
- `stopLoop()` — This will stop the `colorLoop()` function if it's activated.
- `changeColor(hue)` — Specifiying a hue between 0 and 360, this will make the RGB LED transition smoothly from one hue to the specified one.
- `dimTransition(hue)` — Like `colorTransition()`, a hue is specified between 0 and 360, but the previous colour will fade out and then the LED will fade up with the new one.

## Enjoy this project? Support the author!

I hope you enjoyed this little project! I hope you found it helpful. Feel free to [support me and get perks through my Patreon](https://www.patreon.com/IainIsCreative)! Alternatively, [you can donate to my PayPal](https://paypal.me/IainIsCreative) [follow me on Twitter](https://twitter.com/IainIsCreative) and [subscribe to my mailing list](http://iain.is/) to get updates!
