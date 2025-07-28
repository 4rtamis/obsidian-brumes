export type BrumesMode = "city-of-mist" | ":otherscape" | "legend-in-the-mist";

export interface BrumesSettings {
	mode: BrumesMode;
	// add more config as needed
}

export const DEFAULT_SETTINGS: BrumesSettings = {
	mode: "city-of-mist",
};
