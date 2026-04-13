export type BrumesMode = "city-of-mist" | ":otherscape" | "legend-in-the-mist";

export type LogLevel = "none" | "error" | "warn" | "info" | "debug";

export interface BrumesSettings {
	mode: BrumesMode;
	logLevel: LogLevel;
	lanternUrl: string;
}

export const DEFAULT_SETTINGS: BrumesSettings = {
	mode: "city-of-mist",
	logLevel: "error",
	lanternUrl: "https://lantern.ravenloft.fr",
};
