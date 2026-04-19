import { BrumesMode } from "./types";
import cityOfMistBorderPreset from "../../themes/city-of-mist.settings.json";
import legendInTheMistBorderPreset from "../../themes/legend-in-the-mist.settings.json";

function stringifyBorderPreset(preset: Record<string, unknown>): string {
	return JSON.stringify(preset, null, "\t");
}

export const CITY_OF_MIST_BORDER_PRESET = stringifyBorderPreset(cityOfMistBorderPreset);

export const LEGEND_IN_THE_MIST_BORDER_PRESET = stringifyBorderPreset(
	legendInTheMistBorderPreset,
);

export const ADVANCED_CANVAS_ICEBERG_SNIPPET = `/* @advanced-canvas-node-style
key: iceberg-card
label: Iceberg Card
options:
  -
    label: Location
    value: location
    icon: building-2

  -
    label: Character
    value: character
    icon: user

  -
    label: Group
    value: group
    icon: users

  -
    label: Sticky Note
    value: sticky-note
    icon: sticky-note

  -
    label: Unset
    value: null
    icon: eye-off
*/`;

export const ADVANCED_CANVAS_MOUNTAIN_SNIPPET = `/* @advanced-canvas-node-style
key: mountain-card
label: Mountain Card
options:
  -
    label: Greatness
    value: greatness
    icon: crown

  -
    label: Adventure
    value: adventure
    icon: swords

  -
    label: Origin
    value: origin
    icon: leaf

  -
    label: Standard
    value: standard
    icon: scroll

  -
    label: Unset
    value: null
    icon: eye-off
*/`;

export function getBorderPresetForMode(mode: BrumesMode): {
	label: string;
	content: string;
} | null {
	switch (mode) {
		case "city-of-mist":
			return {
				label: "City of Mist",
				content: CITY_OF_MIST_BORDER_PRESET,
			};
		case "legend-in-the-mist":
			return {
				label: "Legend in the Mist",
				content: LEGEND_IN_THE_MIST_BORDER_PRESET,
			};
		default:
			return null;
	}
}
