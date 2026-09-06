import type {
	BrumesFeatureSettings,
	BrumesMode,
	BrumesSettings,
} from "../../settings/types";

/**
 * Everything a fenced Brumes block needs: how it is written, when it is
 * active, how it is parsed, how it is rendered, and how it is inserted.
 */
export interface BrumesBlock<T> {
	/** The code block language, e.g. `story-theme`. */
	id: string;
	/** Older ids kept working after a rename. */
	aliases?: string[];
	/** The mode this block belongs to. */
	mode: BrumesMode;
	/** The feature flag that turns it on. */
	flag: keyof BrumesFeatureSettings;
	/** Context menu entry title. */
	label: string;
	/** Context menu entry icon. */
	icon: string;
	parse(source: string): T | null;
	render(data: T, doc: Document): HTMLElement;
	template(): string;
}

export function isBlockEnabled(
	block: BrumesBlock<unknown>,
	settings: BrumesSettings,
): boolean {
	return settings.mode === block.mode && settings.features[block.flag];
}

/** The block id followed by every alias it answers to. */
export function blockIds(block: BrumesBlock<unknown>): string[] {
	return [block.id, ...(block.aliases ?? [])];
}
