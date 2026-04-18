import { addIcon, EventRef, MarkdownView, Notice, Plugin } from "obsidian";
import { loadTagFeature } from "./features/tags";
import { BrumesSettingTab } from "./settings";
import { BrumesSettings, normalizeSettings } from "./settings/types";
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
import { loadCalloutAliasFeature } from "./features/callouts/aliasSupport";

interface ApplySettingsOptions {
	refreshEditor?: boolean;
	refreshMarkdown?: boolean;
}

export default class BrumesPlugin extends Plugin {
	settings!: BrumesSettings;
	private contextMenuEventRef: EventRef | null = null;
	private lanternRibbonEl: HTMLElement | null = null;
	private syncCalloutAliases: (() => void) | null = null;

	async onload() {
		await this.loadSettings();

		log.setLevel(this.settings.logLevel);
		addIcon(LANTERN_ICON, LANTERN_LOGO_SVG);
		log.info("Brumes plugin loaded");

		this.registerView(
			LANTERN_VIEW_TYPE,
			(leaf) => new LanternView(leaf, this),
		);

		this.addSettingTab(new BrumesSettingTab(this.app, this));

		loadTagFeature(this);
		loadStoryThemesFeature(this);
		this.syncCalloutAliases = loadCalloutAliasFeature(this);

		this.applySettings();
	}

	onunload() {
		if (this.contextMenuEventRef) {
			this.app.workspace.offref(this.contextMenuEventRef);
			this.contextMenuEventRef = null;
		}

		this.lanternRibbonEl?.remove();
		this.lanternRibbonEl = null;
		log.info("Brumes plugin unloaded");
	}

	async activateLanternView() {
		if (!this.settings.features.lanternIntegration) {
			new Notice(
				// eslint-disable-next-line obsidianmd/ui/sentence-case
				"Enable Lantern in the Mist integration in Brumes settings first.",
			);
			return;
		}

		const leaf = this.app.workspace.getLeaf(true);

		await leaf.setViewState({
			type: LANTERN_VIEW_TYPE,
			active: true,
		});
		void this.app.workspace.revealLeaf(leaf);
	}

	async saveSettings(options: ApplySettingsOptions = {}) {
		await this.saveData(this.settings);
		this.applySettings(options);
	}

	private applySettings(options: ApplySettingsOptions = {}) {
		log.setLevel(this.settings.logLevel);
		setBrumesModeClass(this.settings.mode);
		this.refreshLanternIntegration();
		this.refreshContextMenu();
		this.syncCalloutAliases?.();

		if (options.refreshEditor) {
			this.app.workspace.updateOptions();
		}

		if (options.refreshMarkdown) {
			this.refreshMarkdownViews();
		}
	}

	private refreshContextMenu() {
		if (this.contextMenuEventRef) {
			this.app.workspace.offref(this.contextMenuEventRef);
		}

		this.contextMenuEventRef = registerBrumesContextMenu(this);
	}

	private refreshLanternIntegration() {
		if (this.settings.features.lanternIntegration) {
			if (!this.lanternRibbonEl) {
				this.lanternRibbonEl = this.addRibbonIcon(
					LANTERN_ICON,
					// eslint-disable-next-line obsidianmd/ui/sentence-case
					"Lantern in the Mist",
					() => {
						void this.activateLanternView();
					},
				);
			}
			return;
		}

		this.lanternRibbonEl?.remove();
		this.lanternRibbonEl = null;
		this.app.workspace.detachLeavesOfType(LANTERN_VIEW_TYPE);
	}

	private refreshMarkdownViews() {
		for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
			const view = leaf.view;
			if (view instanceof MarkdownView) {
				view.previewMode.rerender(true);
			}
		}
	}

	private async loadSettings() {
		const data: unknown = await this.loadData();
		this.settings = normalizeSettings(
			isSettingsData(data) ? data : undefined,
		);
	}
}

function isSettingsData(
	value: unknown,
): value is Partial<BrumesSettings> | null {
	return value === null || typeof value === "object";
}
