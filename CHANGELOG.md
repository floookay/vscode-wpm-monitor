# Changelog

All notable changes to the `vscode-wpm-monitor` extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2020-07-20

### Patched

- patched lodash security vulnerability

### Changed

- removed space key from being counted towards the wpm counter
- added maximum number of inputs to be considered for the wpm calculation (60000 &rarr; 10h@100wpm)

## [0.3.0] - 2020-07-01

### Added

- added optional automatic wpm reset after a specified duration of no new user input
- added persistent configurations, editable in `settings.json`

### Removed

- removed the majority of the temporary configuration prompts (moved configuration to `settings.json`)

## [0.2.1] - 2020-07-01

### Changed

- clarified the description of the extension

## [0.2.0] - 2020-06-22

### Added

- time based wpm mode and a command prompt mode switcher
- configuration options for length of the timeframe and number of characters to be considered for wpm calculation
- special effect that is displayed after you reach a wpm threshold
- option to reset the wpm display with a command or clicking the counter in the status bar

## 0.1.0

### Added

- basic functionality and character based wpm mode
