// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WpmMonitorStatusBar } from './wpmMonitorStatusBar';

// CONSTANTS
const wordsLength: number = 5;	// number of characters to be considered as a word
// all available modes
enum Mode {
	character = "WPM per character",
	time = "WPM per time"
}

// CONFIGURATION DEFAULTS (gets overwritten by loadConfiguration())
let config = {
	mode: Mode.character,
	character: 100,
	duration: 60,
	specialeffect: {
		symbol: "🔥",
		threshold: 80
	}
};

// VARIABLES
let inputTimestamps: number[] = [];

// OBJECTS
let documentChangeListenerDisposer: vscode.Disposable;
let wpmMonitor = new WpmMonitorStatusBar();


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "vscode-wpm-monitor" is now active!');

	

	// add the status bar widget
	context.subscriptions.push(wpmMonitor);

	documentChangeListenerDisposer = vscode.workspace.onDidChangeTextDocument(onDidChangeTextDocument);
	vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration);
	// load the configuration of the extension
	loadConfiguration();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const modeSwitcherCommand = vscode.commands.registerCommand('extension.modeSwitcher', () => {
		// display mode-switcher
		vscode.window.showQuickPick(Object.values(Mode)).then((m) => {
			switch (m) {
				case Mode.character:
					// wpm over specified number of characters
					config.mode = Mode.character;
					break;
				case Mode.time:
					// wpm over specified time frame
					config.mode = Mode.time;
					break;
				default:
					// don't change anything
					break;
			}
			reset();
		});
	});
	context.subscriptions.push(modeSwitcherCommand);
}

function reset() {
	inputTimestamps = [];
	wpmMonitor.setWPM(0);
}

function loadConfiguration() {
	const c = vscode.workspace.getConfiguration("wpm-monitor");
	config.mode = (c.get("defaultMode") === "time") ? Mode.time : Mode.character;
	config.character = c.get("mode.character.numberOf") || 100;
	config.duration = c.get("mode.time.duration") || 60;
	config.specialeffect.symbol = c.get("specialEffect.symbol") || "🔥";
	config.specialeffect.threshold = c.get("specialEffect.threshold") || 80;

	// set config of the status bar widget
	wpmMonitor.setSpecialEffect(config.specialeffect.symbol);
	wpmMonitor.setSpecialEffectThreshold(config.specialeffect.threshold);
}

function onDidChangeConfiguration(event: vscode.ConfigurationChangeEvent) {
	if (event.affectsConfiguration("wpm-monitor")) {
		loadConfiguration();
		reset();
	}
}



function onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
	let input = event.contentChanges[0].text;	// string of characters entered

	// remove EOL timestamps
	switch (config.mode) {
		case Mode.character:
			// remove the oldest timestamps until threshold is reached (could also be done with if)
			while (inputTimestamps.length >= config.character) {
				inputTimestamps.shift();
			}
			break;

		case Mode.time:
			let threshold = Date.now() - config.duration * 1000;
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
		let newest = inputTimestamps[inputTimestamps.length - 1];
		let minute = (newest - oldest) / 1000 / 60;
		let words = inputTimestamps.length / wordsLength;
		wpm = Math.floor(words / minute);
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