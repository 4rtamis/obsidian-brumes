import { App, PluginSettingTab, Setting } from "obsidian";
import BrumesPlugin from "../BrumesPlugin";
import { BrumesMode } from "./types";

export class BrumesSettingTab extends PluginSettingTab {
	plugin: BrumesPlugin;

	constructor(app: App, plugin: BrumesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Brumes Plugin Settings" });

		new Setting(containerEl)
			.setName("Game Mode")
			.setDesc("Choose which rule system you're working with.")
			.addDropdown((drop) =>
				drop
					.addOption("city-of-mist", "City of Mist")
					.addOption(":otherscape", ":Otherscape")
					.addOption("legend-in-the-mist", "Legend in the Mist")
					.setValue(this.plugin.settings.mode)
					.onChange(async (value: BrumesMode) => {
						this.plugin.settings.mode = value;
						await this.plugin.saveData(this.plugin.settings);
					}),
			);
	}
}
