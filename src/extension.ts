// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WpmMonitorStatusBar } from './wpmMonitorStatusBar';

// CONSTANTS
const wordsLength: number = 5;	// number of characters to be considered a word
// all available modes
enum Mode {
	character = "WPM per character",
	time = "WPM per time"
}

// CONFIGURATION
let wpmInterval: number = 30;	// in seconds
let wpmCharacters: number = 100;	// Number of characters to be considered to calculate wpm

// VARIABLES
let inputTimestamps:number[] = [];
let mode:Mode = Mode.character;

// OBJECTS
let documentChangeListenerDisposer: vscode.Disposable;
let wpmMonitor = new WpmMonitorStatusBar();


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-wpm-monitor" is now active!');

	// add the status bar widget
	context.subscriptions.push(wpmMonitor);

	documentChangeListenerDisposer = vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument);
	// vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
	// onDidChangeConfiguration();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const modeSwitcherCommand = vscode.commands.registerCommand('extension.modeSwitcher', () => {
		// display mode-switcher
		vscode.window.showQuickPick(Object.values(Mode)).then((m) => {
			switch (m) {
				case Mode.character:
					// wpm over specified number of characters
					vscode.window.showInformationMessage("bruv haha XD");
					mode = Mode.character;
					break;
				case Mode.time:
					// wpm over specified time frame
					mode = Mode.time;
					vscode.window.showInformationMessage("l-o-fucking-l bruh");
					break;
				default:
					// don't change anything
					vscode.window.showInformationMessage("ahaha I hope I die");
					break;
			}
			reset();
		});
	});
	context.subscriptions.push(modeSwitcherCommand);

	// prompt to edit number of characters in character mode
	const modeSetNumberOfCharactersCommand = vscode.commands.registerCommand('extension.modeSetNumberOfCharacters', () => {
		// set options for input dialog
		let options:vscode.InputBoxOptions = {
			prompt: "Enter the number of characters on which the WPM is calculated",
			value: "100",
			validateInput: (value:string) => {
				return isNaN(+value) ? "not a number" : undefined;
			}
		};
		vscode.window.showInputBox(options).then((v) => {
			wpmCharacters = (v) ? +v : 100;
		});
	});
	context.subscriptions.push(modeSetNumberOfCharactersCommand);

	// prompt to edit the length of the timeframe in time mode
	const modeSetLengthOfTimeframeCommand = vscode.commands.registerCommand('extension.modeSetLengthOfTimeframe', () => {
		// set options for input dialog
		let options:vscode.InputBoxOptions = {
			prompt: "Enter the interval in which the WPM will be calculated (in seconds)",
			value: "30",
			validateInput: (value:string) => {
				return isNaN(+value) ? "not a number" : undefined;
			}
		};
		vscode.window.showInputBox(options).then((v) => {
			wpmInterval = (v) ? +v : 30;
		});
	});
	context.subscriptions.push(modeSetLengthOfTimeframeCommand);

	/*
	// NOT IN USE ATM
	// register command in in package.json
	{
		"command": "extension.setSpecialEffect",
		"title": "WPM-monitor: enter a character/emoji to be displayed in the status bar when surpassing a threshold"
	}
	// prompt to edit the special effect that will be displayed in the statusbar after surpassing the wpm threshold
	const setSpecialEffectCommand = vscode.commands.registerCommand('extension.setSpecialEffect', () => {
		// set options for input dialog
		let options:vscode.InputBoxOptions = {
			prompt: "Enter the characters that will be displayed after the threshold is surpassed",
			value: wpmMonitor.getSpecialEffect().toString(),	// current value
			validateInput: (value:string) => {
				return (value.length > 8) ? "too long" : undefined;
			}
		};
		vscode.window.showInputBox(options).then((v) => {
			wpmMonitor.setSpecialEffect((v) ? v : "🔥");
		});
	});
	context.subscriptions.push(setSpecialEffectCommand);
	*/

	// prompt to edit the threshold after which the special effect will be displayed in the statusbar
	const setSpecialEffectThresholdCommand = vscode.commands.registerCommand('extension.setSpecialEffectThreshold', () => {
		// set options for input dialog
		let options:vscode.InputBoxOptions = {
			prompt: "Enter the wpm threshold after which the special effect will be displayed",
			value: wpmMonitor.getSpecialEffectThreshold().toString(),	// current value
			validateInput: (value:string) => {
				return isNaN(+value) ? "not a number" : undefined;
			}
		};
		vscode.window.showInputBox(options).then((v) => {
			wpmMonitor.setSpecialEffectThreshold((v) ? +v : 80);
		});
	});
	context.subscriptions.push(setSpecialEffectThresholdCommand);

	// resets the values for wpm calculation
	const resetCommand = vscode.commands.registerCommand('extension.reset', () => {
		reset();
	});
	context.subscriptions.push(resetCommand);
}

function reset() {
	inputTimestamps = [];
	wpmMonitor.setWPM(0);
}

function onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
	let input = event.contentChanges[0].text;	// string of characters entered

	// remove EOL timestamps
	switch (mode) {
		case Mode.character:
			// remove the oldest timestamps until threshold is reached (could also be done with if)
			while (inputTimestamps.length >= wpmCharacters) {
				inputTimestamps.shift();
			}
			break;
	
		case Mode.time:
			let threshold = Date.now() - wpmInterval*1000;
			// remove all timestamps that are older than the threshold-timestamp (array/list is sorted with oldest first)
			while (inputTimestamps[0] < threshold) {
				inputTimestamps.shift();
			}
			break;
		default:
			break;
	}
	

	// skip deletions (wpm won't get updated)
	if (input === "") {
		return;
	}
	// TODO: skip copy paste items, language specific skip lists, user skip lists

	// Add newest input as timestamp to list
	inputTimestamps.push(Date.now());
	// console.log(event.contentChanges[0].text);

	// calculate the wpm
	let wpm = 0;
	if (inputTimestamps.length >= 2) {
		let oldest = inputTimestamps[0];
		let newest = inputTimestamps[inputTimestamps.length-1];
		let minute = (newest - oldest) / 1000 / 60;
		let words = inputTimestamps.length / wordsLength;
		wpm = Math.floor(words/minute);
	}
	wpmMonitor.setWPM(wpm);
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (wpmMonitor) {
		wpmMonitor.dispose();
	}
	if (documentChangeListenerDisposer) {
		documentChangeListenerDisposer.dispose();
	}
}
