import { Plugin } from "obsidian";
import { loadTagFeature } from "./features/tags";
import { BrumesSettingTab } from "./settings";
import { BrumesSettings, DEFAULT_SETTINGS } from "./settings/types";
import { log } from "./utils/logger";
import { setBrumesModeClass } from "./features/modes/domModeClass";
import { loadStoryThemesFeature } from "./features/storyThemes";
import { registerBrumesContextMenu } from "./contextMenu";

export default class BrumesPlugin extends Plugin {
	settings: BrumesSettings;

	async onload() {
		await this.loadSettings();

		log.setLevel(this.settings.logLevel);
		setBrumesModeClass(this.settings.mode);

		log.info("Brumes plugin loaded");

		this.addSettingTab(new BrumesSettingTab(this.app, this));

		loadTagFeature(this);
		loadStoryThemesFeature(this);

		registerBrumesContextMenu(this.app);
	}

	onunload() {
		log.info("Brumes plugin unloaded");
	}

	private async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}
}
