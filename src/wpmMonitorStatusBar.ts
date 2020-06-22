import * as vscode from 'vscode';

export class WpmMonitorStatusBar {
	private interval:number = 1000;	// interval (milliseconds) in which the status bar gets updated
	private statusBar: vscode.StatusBarItem;
	private wpm: number = 0;
	private specialEffectThreshold: number = 80;
	private specialEffect: string = "🔥";

	constructor() {
		this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
		this.statusBar.command = "extension.reset";	// reset on click
		this.statusBar.show();

		this.updateUI();
	}

	public setWPM(wpm: number) {
		this.wpm = wpm;
	}

	public getSpecialEffect() {
		return this.specialEffect;
	}
	public setSpecialEffect(specialEffect: string) {
		this.specialEffect = specialEffect;
	}

	public getSpecialEffectThreshold() {
		return this.specialEffectThreshold;
	}
	public setSpecialEffectThreshold(specialEffectThreshold: number) {
		this.specialEffectThreshold = specialEffectThreshold;
	}
	
	private updateUI() {
		return setInterval(()=> {
		this.statusBar.text = `${this.wpm >= this.specialEffectThreshold ? this.specialEffect + " ":""}${this.wpm.toString()} wpm`;
		}, this.interval);
	}

	public dispose() {
		this.statusBar.dispose();
		clearInterval(this.updateUI());
	}
}