import { ItemView, sanitizeHTMLToDom, WorkspaceLeaf } from "obsidian";
import BrumesPlugin from "../BrumesPlugin";
import { LANTERN_LOGO_SVG } from "./lanternLogo";

export const LANTERN_VIEW_TYPE = "brumes-lantern-view";
export const LANTERN_ICON = "brumes-lantern";

export class LanternView extends ItemView {
	plugin: BrumesPlugin;
	private loadingOverlayEl: HTMLDivElement | null = null;
	private iframeEl: HTMLIFrameElement | null = null;

	// eslint-disable-next-line obsidianmd/prefer-active-doc
	constructor(leaf: WorkspaceLeaf, plugin: BrumesPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.navigation = true;
		this.icon = LANTERN_ICON;
	}

	getViewType(): string {
		return LANTERN_VIEW_TYPE;
	}

	getDisplayText(): string {
		return "Lantern in the Mist"; // eslint-disable-line obsidianmd/ui/sentence-case
	}

	async onOpen() {
		this.render();
		this.addAction("external-link", "Open Lantern in browser", () => {
			this.contentEl.win.open(
				this.plugin.settings.lanternUrl,
				"_blank",
				"noopener",
			);
		});
		this.addAction("refresh-cw", "Reload Lantern", () => {
			this.render();
		});
	}

	async onClose() {
		this.contentEl.empty();
		this.loadingOverlayEl = null;
		this.iframeEl = null;
	}

	private render() {
		const { contentEl } = this;
		const lanternUrl = this.plugin.settings.lanternUrl.trim();

		contentEl.empty();
		contentEl.addClass("brumes-lantern-view");
		const wrapper = contentEl.createDiv({
			cls: "brumes-lantern-view__wrapper",
		});

		const overlay = wrapper.createDiv({
			cls: "brumes-lantern-view__loading",
		});
		const logo = overlay.createDiv({
			cls: "brumes-lantern-view__loading-logo",
		});
		logo.appendChild(sanitizeHTMLToDom(LANTERN_LOGO_SVG));
		overlay
			.createDiv({
				cls: "brumes-lantern-view__loading-bar",
			})
			.createDiv({
				cls: "brumes-lantern-view__loading-bar-value",
			});

		const iframe = wrapper.createEl("iframe", {
			cls: "brumes-lantern-view__iframe",
		});
		iframe.addEventListener("load", () => {
			overlay.addClass("is-hidden");
		});
		iframe.src = lanternUrl;
		iframe.setAttr("allow", "clipboard-read; clipboard-write");
		iframe.setAttr("referrerpolicy", "no-referrer");
		iframe.setAttr(
			"sandbox",
			"allow-scripts allow-same-origin allow-forms allow-popups allow-downloads",
		);
		iframe.setAttr("frameborder", "0");
		iframe.setAttr("title", "Lantern in the Mist");

		this.loadingOverlayEl = overlay;
		this.iframeEl = iframe;
	}
}
