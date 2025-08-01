import { BrumesMode } from "../../settings/types";

const MODE_CLASSES = [
	"brumes--city-of-mist",
	"brumes--otherscape",
	"brumes--legend-in-the-mist",
];

export function setBrumesModeClass(mode: BrumesMode) {
	const body = document.body;

	// Remove existing mode classes
	for (const cls of MODE_CLASSES) {
		body.classList.remove(cls);
	}

	// Add the new class
	body.classList.add(`brumes--${mode}`);
}
