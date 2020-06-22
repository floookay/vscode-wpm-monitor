# WPM Monitor - README

The extension `vscode-wpm-monitor` enables a words-per-minute counter in the status bar.

![showcase](./img/showcase.gif)

## Features

The monitor offers two modes:

- a character based mode: where the wpm is calculated over the last 100 characters entered
- a time based mode: where the wpm is calculated over a fixed timeframe

You can switch modes and edit the number of characters or length of the timeframe with the command prompt.

There's also a special effect that shows in the status bar if you type faster than a specified threshold, which you can also edit via the command prompt.

## Known Issues

- the wpm monitor also gets displayed in the status bar if no text window is open

## Release Notes

### 0.2.0

- added a time based wpm mode and a command prompt mode switcher
- added configuration options for length of the timeframe and number of characters to be considered for wpm calculation
- added a special effect that is displayed after you reach a wpm threshold
- added option to reset the wpm display with a command or clicking the counter in the status bar

### 0.1.0

- added basic functionality and character based wpm mode

## TODO

- [x] add configuration commands (number of characters, reset monitor)
- [x] maybe add optional command for silly special effects like '🔥' when typing above 80 wpm
- [x] maybe add a time-based mode instead of a character based mode
- [ ] maybe add optional language specific skiplists (e.g. don't count semicolons in C++)
