// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WpmMonitorStatusBar } from './wpmMonitorStatusBar';

let documentChangeListenerDisposer: vscode.Disposable;
let wpmMonitor = new WpmMonitorStatusBar();
let count:number = 0;
let inputTimestamps:number[] = [];

const wordsLength: number = 5;
const wpmInterval: number = 15; // in seconds
const wpmCharacters: number = 100; // Number of characters to be considered to calculate wpm

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

	// set up interval to restart start
}

function onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent) {
	let input = event.contentChanges[0].text;	// string of characters entered

	// remove EOL timestamps
	while (inputTimestamps.length >= wpmCharacters) {
		inputTimestamps.shift();
	}

	// skip deletions
	if (input === "") {
		return;
	}
	inputTimestamps.push(Date.now());
	// console.log(event.contentChanges[0].text);

	let wpm = 0;
	if (inputTimestamps.length >= 2) {
		let oldest = inputTimestamps[0];
		let newest = inputTimestamps[inputTimestamps.length-1];
		let minute = (newest - oldest) / 1000 / 60;
		console.log(minute);
		let words = inputTimestamps.length / wordsLength;
		wpm = Math.floor(words/minute);
	}
	wpmMonitor.setWPM(wpm);
}

// this method is called when your extension is deactivated
export function deactivate() {
	// remove the status bar widget
	if (documentChangeListenerDisposer) {
		documentChangeListenerDisposer.dispose();
		// documentChangeListenerDisposer = null;
	}
}
