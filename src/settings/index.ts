import { App, Notice, PluginSettingTab, SettingGroup } from "obsidian";
import BrumesPlugin from "../BrumesPlugin";
import { BrumesMode, LogLevel, sanitizeAliases } from "./types";
import { log } from "../utils/logger";
import {
	ADVANCED_CANVAS_ICEBERG_SNIPPET,
	getBorderPresetForMode,
} from "./borderPresets";

export class BrumesSettingTab extends PluginSettingTab {
	plugin: BrumesPlugin;

	constructor(app: App, plugin: BrumesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const generalSection = this.createSection(containerEl);
		generalSection.addSetting((setting) =>
			setting
				.setName("Game mode")
				.setDesc(
					"Choose the game line you are preparing for. This updates the main Brumes style and the Brumes editor context menu.",
				)
				.addDropdown((drop) =>
					drop
						.addOption("city-of-mist", "City of Mist")
						.addOption("legend-in-the-mist", "Legend in the Mist")
						.addOption("otherscape", ":Otherscape")
						.setValue(this.plugin.settings.mode)
						.onChange(async (value: BrumesMode) => {
							this.plugin.settings.mode = value;
							await this.plugin.saveSettings({
								refreshMarkdown: true,
							});
							this.display();
						}),
				),
		);
		this.renderBorderSection(generalSection);
		this.renderGeneralSettings(generalSection);

		const cityOfMistSection = this.createSection(
			containerEl,
			this.plugin.settings.mode !== "city-of-mist",
		);
		cityOfMistSection.setHeading("City of Mist");
		this.renderCityOfMistSettings(cityOfMistSection);

		const legendInTheMistSection = this.createSection(
			containerEl,
			this.plugin.settings.mode !== "legend-in-the-mist",
		);
		legendInTheMistSection.setHeading("Legend in the Mist");
		this.renderLegendInTheMistSettings(legendInTheMistSection);

		const otherscapeSection = this.createSection(
			containerEl,
			this.plugin.settings.mode !== "otherscape",
		);
		otherscapeSection.setHeading(":Otherscape");
		this.renderOtherscapeSettings(otherscapeSection);

		const advancedSection = this.createSection(containerEl);
		advancedSection.setHeading("Advanced");
		this.renderAdvancedSection(advancedSection);
	}

	private renderBorderSection(section: SettingGroup) {
		const preset = getBorderPresetForMode(this.plugin.settings.mode);

		section.addSetting((setting) =>
			setting
				.setName("Border preset")
				.setDesc(this.createBorderPresetDescription(Boolean(preset)))
				.addButton((button) =>
					button
						.setButtonText(preset ? "Copy preset" : "Unavailable")
						.setDisabled(!preset)
						.onClick(async () => {
							if (!preset) {
								new Notice(
									"No Border preset is available for :Otherscape yet.",
								);
								return;
							}

							try {
								await navigator.clipboard.writeText(
									preset.content,
								);
								new Notice(
									`${preset.label} Border preset copied to clipboard.`,
								);
							} catch (error) {
								log.error(
									"Failed to copy Border preset",
									error,
								);
								new Notice("Failed to copy the Border preset.");
							}
						}),
				),
		);
	}

	private renderGeneralSettings(section: SettingGroup) {
		section.addSetting((setting) =>
			setting
				.setName("Tags, statuses and limits")
				.setDesc(
					"Enable the special markdown syntax, parsing and context menu action for tags, statuses and limits.",
				)
				.addToggle((toggle) =>
					toggle
						.setValue(this.plugin.settings.features.tagsSyntax)
						.onChange(async (value) => {
							this.plugin.settings.features.tagsSyntax = value;
							await this.plugin.saveSettings({
								refreshEditor: true,
								refreshMarkdown: true,
							});
						}),
				),
		);

		section.addSetting((setting) =>
			setting
				.setName("Lantern in the Mist integration")
				.setDesc(
					"Show the Lantern ribbon icon and keep the embedded Lantern view available.",
				)
				.addToggle((toggle) =>
					toggle
						.setValue(
							this.plugin.settings.features.lanternIntegration,
						)
						.onChange(async (value) => {
							this.plugin.settings.features.lanternIntegration =
								value;
							await this.plugin.saveSettings();
							this.display();
						}),
				),
		);

		section.addSetting((setting) =>
			setting
				.setName("Lantern in the Mist URL")
				.setDesc(
					"Address used by the Lantern ribbon action and embedded tab.",
				)
				.setDisabled(!this.plugin.settings.features.lanternIntegration)
				.addText((text) =>
					text
						.setPlaceholder("https://lantern.ravenloft.fr")
						.setValue(this.plugin.settings.lanternUrl)
						.setDisabled(
							!this.plugin.settings.features.lanternIntegration,
						)
						.onChange(async (value) => {
							this.plugin.settings.lanternUrl = value.trim();
							await this.plugin.saveSettings();
						}),
				),
		);
	}

	private renderCityOfMistSettings(section: SettingGroup) {
		const isActive = this.plugin.settings.mode === "city-of-mist";

		this.addAliasSetting(
			section,
			"Note aliases",
			this.plugin.settings.calloutAliases.cityOfMist.note,
			"One alias per line. The first alias is inserted from the context menu.",
			!isActive,
			async (aliases) => {
				this.plugin.settings.calloutAliases.cityOfMist.note = aliases;
				await this.plugin.saveSettings();
			},
		);

		this.addAliasSetting(
			section,
			"Move aliases",
			this.plugin.settings.calloutAliases.cityOfMist.move,
			"One alias per line. The first alias is inserted from the context menu.",
			!isActive,
			async (aliases) => {
				this.plugin.settings.calloutAliases.cityOfMist.move = aliases;
				await this.plugin.saveSettings();
			},
		);

		this.addAliasSetting(
			section,
			"Description aliases",
			this.plugin.settings.calloutAliases.cityOfMist.description,
			"One alias per line. The first alias is inserted from the context menu.",
			!isActive,
			async (aliases) => {
				this.plugin.settings.calloutAliases.cityOfMist.description =
					aliases;
				await this.plugin.saveSettings();
			},
		);

		this.addAliasSetting(
			section,
			"Clue aliases",
			this.plugin.settings.calloutAliases.cityOfMist.clue,
			"One alias per line. The first alias is inserted from the context menu.",
			!isActive,
			async (aliases) => {
				this.plugin.settings.calloutAliases.cityOfMist.clue = aliases;
				await this.plugin.saveSettings();
			},
		);

		this.addAliasSetting(
			section,
			"Red clue aliases",
			this.plugin.settings.calloutAliases.cityOfMist.redClue,
			"One alias per line. The first alias is inserted from the context menu.",
			!isActive,
			async (aliases) => {
				this.plugin.settings.calloutAliases.cityOfMist.redClue =
					aliases;
				await this.plugin.saveSettings();
			},
		);

		section.addSetting((setting) =>
			setting
				.setName("Iceberg canvas snippet")
				.setDesc(this.createIcebergDescription())
				.setDisabled(!isActive)
				.addButton((button) =>
					button
						.setButtonText("Copy snippet")
						.setDisabled(!isActive)
						.onClick(async () => {
							try {
								await navigator.clipboard.writeText(
									ADVANCED_CANVAS_ICEBERG_SNIPPET,
								);
								new Notice(
									"Iceberg canvas snippet copied to clipboard.",
								);
							} catch (error) {
								log.error(
									"Failed to copy iceberg snippet",
									error,
								);
								new Notice(
									"Failed to copy the iceberg snippet.",
								);
							}
						}),
				),
		);
	}

	private renderLegendInTheMistSettings(section: SettingGroup) {
		const isActive = this.plugin.settings.mode === "legend-in-the-mist";

		this.addAliasSetting(
			section,
			"Note aliases",
			this.plugin.settings.calloutAliases.legendInTheMist.note,
			"One alias per line. The first alias is inserted from the context menu.",
			!isActive,
			async (aliases) => {
				this.plugin.settings.calloutAliases.legendInTheMist.note =
					aliases;
				await this.plugin.saveSettings();
			},
		);

		this.addAliasSetting(
			section,
			"Read-aloud aliases",
			this.plugin.settings.calloutAliases.legendInTheMist.readAloud,
			"One alias per line. The first alias is inserted from the context menu.",
			!isActive,
			async (aliases) => {
				this.plugin.settings.calloutAliases.legendInTheMist.readAloud =
					aliases;
				await this.plugin.saveSettings();
			},
		);

		section.addSetting((setting) =>
			setting
				.setName("Story theme parser")
				.setDesc(
					"Enable the story-theme code block parser and context menu action.",
				)
				.setDisabled(!isActive)
				.addToggle((toggle) =>
					toggle
						.setValue(
							this.plugin.settings.features.storyThemeParser,
						)
						.setDisabled(!isActive)
						.onChange(async (value) => {
							this.plugin.settings.features.storyThemeParser =
								value;
							await this.plugin.saveSettings({
								refreshMarkdown: true,
							});
						}),
				),
		);
	}

	private renderOtherscapeSettings(section: SettingGroup) {
		section.addSetting((setting) =>
			setting
				.setName("Nothing yet!")
				.setDesc(
					":Otherscape support is planned but not implemented yet.",
				),
		);
	}

	private renderAdvancedSection(section: SettingGroup) {
		section.addSetting((setting) =>
			setting
				.setName("Log level")
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
							await this.plugin.saveSettings();
						}),
				),
		);
	}

	private addAliasSetting(
		section: SettingGroup,
		name: string,
		aliases: string[],
		description: string,
		disabled: boolean,
		onSave: (aliases: string[]) => Promise<void>,
	) {
		section.addSetting((setting) =>
			setting
				.setName(name)
				.setDesc(description)
				.setDisabled(disabled)
				.addTextArea((text) => {
					text.setValue(aliases.join("\n"));
					text.inputEl.rows = Math.max(3, aliases.length || 1);
					text.inputEl.placeholder = "one-alias-per-line";
					text.setDisabled(disabled);
					text.inputEl.addEventListener("change", async () => {
						const sanitizedAliases = sanitizeAliases(
							text.getValue().split(/\r?\n/g),
						);
						text.setValue(sanitizedAliases.join("\n"));
						await onSave(sanitizedAliases);
					});
				}),
		);
	}

	private createBorderPresetDescription(
		hasPreset: boolean,
	): DocumentFragment {
		const fragment = document.createDocumentFragment();
		fragment.append("Brumes is designed to work alongside the theme ");
		this.appendLink(
			fragment,
			"Border",
			"https://github.com/Akifyss/obsidian-border",
		);
		fragment.append(
			hasPreset
				? " by Akifyss. Copy the preset for the selected mode, then import it with the Style Settings plugin."
				: " by Akifyss. A preset for :Otherscape is not available yet.",
		);
		return fragment;
	}

	private createIcebergDescription(): DocumentFragment {
		const fragment = document.createDocumentFragment();
		fragment.append("Install ");
		this.appendLink(
			fragment,
			"Advanced Canvas",
			"https://github.com/Developer-Mike/obsidian-advanced-canvas",
		);
		fragment.append(
			" by Developer-Mike, then go to Settings > Appearance > CSS snippets, create a snippet named iceberg.css, paste the copied content into that file, and enable the snippet.",
		);
		return fragment;
	}

	private appendLink(parent: DocumentFragment, label: string, href: string) {
		const link = document.createElement("a");
		link.textContent = label;
		link.href = href;
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		parent.append(link);
	}

	private createSection(
		containerEl: HTMLElement,
		inactive = false,
	): SettingGroup {
		const section = new SettingGroup(containerEl);
		if (inactive) {
			section.addClass("is-inactive");
		}
		return section;
	}
}
