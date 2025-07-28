import { Plugin } from "obsidian";
import { loadTagFeature } from "./features/tags";
import { BrumesSettingTab } from "./settings";
import { BrumesSettings, DEFAULT_SETTINGS } from "./settings/types";

export default class BrumesPlugin extends Plugin {
	settings: BrumesSettings;

	async onload() {
		console.log("Loading Brumes Plugin");
		await this.loadSettings();

		this.addSettingTab(new BrumesSettingTab(this.app, this));

		loadTagFeature(this);
	}

	onunload() {
		console.log("Unloading Brumes Plugin");
	}

	private async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}
}
