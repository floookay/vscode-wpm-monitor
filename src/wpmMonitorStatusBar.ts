import * as vscode from 'vscode';

export class WpmMonitorStatusBar { 
	private statusBar: vscode.StatusBarItem;
	private wpm = 0;

	constructor() {
		this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
		this.statusBar.show();

		this.updateUI();
	}

	public setWPM(wpm: number) {
		this.wpm = wpm;
	}

	private updateUI() {
		return setInterval(()=> {
		this.statusBar.text = this.wpm.toString() + " wpm";
		}, 1000);
	}

	public dispose() {
		this.statusBar.dispose();
		clearInterval(this.updateUI());
	}
}