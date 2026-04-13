import { App, PluginSettingTab, Setting } from "obsidian";
import BrumesPlugin from "../BrumesPlugin";
import { BrumesMode, LogLevel } from "./types";
import { log } from "../utils/logger";
import { setBrumesModeClass } from "../features/modes/domModeClass";

export class BrumesSettingTab extends PluginSettingTab {
	plugin: BrumesPlugin;

	constructor(app: App, plugin: BrumesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Game Mode")
			.setDesc(
				"Choose which rule system you're working with. This will affect how basic elements are displayed, such as ",
			)
			.addDropdown((drop) =>
				drop
					.addOption("city-of-mist", "City of Mist")
					.addOption("otherscape", ":Otherscape")
					.addOption("legend-in-the-mist", "Legend in the Mist")
					.setValue(this.plugin.settings.mode)
					.onChange(async (value: BrumesMode) => {
						this.plugin.settings.mode = value;
						setBrumesModeClass(value);
						await this.plugin.saveData(this.plugin.settings);
					}),
			);

		new Setting(containerEl)
			.setName("Log Level")
			.setDesc(
				"Control how much information is logged to the developer console.",
			)
			.addDropdown((drop) =>
				drop
					.addOptions({
						debug: "Debug (verbose)",
						info: "Info",
						warn: "Warnings",
						error: "Errors only",
						none: "None (disable logs)",
					})
					.setValue(this.plugin.settings.logLevel)
					.onChange(async (value: LogLevel) => {
						this.plugin.settings.logLevel = value;
						log.setLevel(value);
						await this.plugin.saveData(this.plugin.settings);
					}),
			);

		new Setting(containerEl)
			.setName("Lantern URL")
			.setDesc(
				"Address used by the Lantern in the Mist ribbon action and embedded tab.",
			)
			.addText((text) =>
				text
					.setPlaceholder("https://lantern.ravenloft.fr")
					.setValue(this.plugin.settings.lanternUrl)
					.onChange(async (value) => {
						this.plugin.settings.lanternUrl = value.trim();
						await this.plugin.saveData(this.plugin.settings);
					}),
			);
	}
}
