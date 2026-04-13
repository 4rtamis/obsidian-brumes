import { addIcon, Plugin } from "obsidian";
import { loadTagFeature } from "./features/tags";
import { BrumesSettingTab } from "./settings";
import { BrumesSettings, DEFAULT_SETTINGS } from "./settings/types";
import { log } from "./utils/logger";
import { setBrumesModeClass } from "./features/modes/domModeClass";
import { loadStoryThemesFeature } from "./features/storyThemes";
import { registerBrumesContextMenu } from "./contextMenu";
import {
	LANTERN_ICON,
	LANTERN_VIEW_TYPE,
	LanternView,
} from "./views/LanternView";
import { LANTERN_LOGO_SVG } from "./views/lanternLogo";

export default class BrumesPlugin extends Plugin {
	settings: BrumesSettings;

	async onload() {
		await this.loadSettings();

		log.setLevel(this.settings.logLevel);
		setBrumesModeClass(this.settings.mode);
		addIcon(LANTERN_ICON, LANTERN_LOGO_SVG);

		log.info("Brumes plugin loaded");

		this.registerView(
			LANTERN_VIEW_TYPE,
			(leaf) => new LanternView(leaf, this),
		);

		this.addSettingTab(new BrumesSettingTab(this.app, this));
		this.addRibbonIcon(
			LANTERN_ICON,
			"Lantern in the Mist",
			async () => await this.activateLanternView(),
		);

		loadTagFeature(this);
		loadStoryThemesFeature(this);

		registerBrumesContextMenu(this.app);
	}

	onunload() {
		log.info("Brumes plugin unloaded");
	}

	async activateLanternView() {
		const leaf = this.app.workspace.getLeaf(true);

		await leaf.setViewState({
			type: LANTERN_VIEW_TYPE,
			active: true,
		});
		this.app.workspace.revealLeaf(leaf);
	}

	private async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}
}
