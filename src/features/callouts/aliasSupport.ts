import type BrumesPlugin from "../../BrumesPlugin";
import { BrumesSettings } from "../../settings/types";

const BRUMES_CALLOUT_STYLE_ATTR = "data-brumes-callout-style";

export function loadCalloutAliasFeature(plugin: BrumesPlugin): () => void {
	const syncAliases = () => syncCalloutAliases(document.body, plugin.settings);
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (
				mutation.type === "attributes" &&
				mutation.target instanceof HTMLElement
			) {
				syncCalloutAliases(mutation.target, plugin.settings);
				continue;
			}

			for (const node of Array.from(mutation.addedNodes)) {
				if (node instanceof HTMLElement) {
					syncCalloutAliases(node, plugin.settings);
				}
			}
		}
	});

	observer.observe(document.body, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeFilter: ["data-callout"],
	});

	plugin.register(() => observer.disconnect());
	syncAliases();

	return syncAliases;
}

function syncCalloutAliases(root: ParentNode, settings: BrumesSettings) {
	const aliasMap = buildAliasMap(settings);

	for (const calloutEl of getCalloutElements(root)) {
		const currentCallout = calloutEl.dataset.callout;
		if (!currentCallout) {
			continue;
		}

		const canonicalCallout = aliasMap.get(currentCallout.toLowerCase());

		if (canonicalCallout) {
			calloutEl.setAttribute(BRUMES_CALLOUT_STYLE_ATTR, canonicalCallout);
			continue;
		}

		calloutEl.removeAttribute(BRUMES_CALLOUT_STYLE_ATTR);
	}
}

function getCalloutElements(root: ParentNode): HTMLElement[] {
	if (!(root instanceof HTMLElement)) {
		return [];
	}

	const elements: HTMLElement[] = [];

	if (root.matches(".callout[data-callout]")) {
		elements.push(root);
	}

	for (const match of Array.from(
		root.querySelectorAll<HTMLElement>(".callout[data-callout]"),
	)) {
		elements.push(match);
	}

	return elements;
}

function buildAliasMap(settings: BrumesSettings): Map<string, string> {
	const aliasMap = new Map<string, string>();

	if (settings.mode === "city-of-mist") {
		for (const alias of settings.calloutAliases.cityOfMist.note) {
			aliasMap.set(alias, "note");
		}

		for (const alias of settings.calloutAliases.cityOfMist.move) {
			aliasMap.set(alias, "move");
		}

		for (const alias of settings.calloutAliases.cityOfMist.description) {
			aliasMap.set(alias, "description");
		}

		for (const alias of settings.calloutAliases.cityOfMist.clue) {
			aliasMap.set(alias, "clue");
		}

		for (const alias of settings.calloutAliases.cityOfMist.redClue) {
			aliasMap.set(alias, "red-clue");
		}
	}

	if (settings.mode === "legend-in-the-mist") {
		for (const alias of settings.calloutAliases.legendInTheMist.note) {
			aliasMap.set(alias, "note");
		}

		for (const alias of settings.calloutAliases.legendInTheMist.readAloud) {
			aliasMap.set(alias, "read-aloud");
		}
	}

	return aliasMap;
}
