export type JourneyType = "landscape" | "occasion" | "undertaking";

export interface JourneyVignette {
	name: string;
	trigger?: string;
	consequences: string[];
}

export interface JourneyData {
	type: JourneyType;
	name: string;
	description: string[];
	tags: string[];
	benefits?: string;
	consequences: string[];
	vignettes: JourneyVignette[];
}

const JOURNEY_TYPES: JourneyType[] = ["landscape", "occasion", "undertaking"];
const TYPE_PREFIX = "journey - ";
const TAGS_PREFIX = "tags:";
const BENEFITS_PREFIX = "benefits:";
const CONSEQUENCES_KEYWORD = "CONSEQUENCES";
const VIGNETTE_PREFIX = "VIGNETTE ";
const TRIGGER_SEPARATOR = " : ";

/** Accept both the bare type and the `Journey - Type` heading the book prints. */
function readType(line: string): JourneyType | null {
	let candidate = line.trim().toLowerCase();

	if (candidate.startsWith(TYPE_PREFIX)) {
		candidate = candidate.slice(TYPE_PREFIX.length).trim();
	}

	return JOURNEY_TYPES.indexOf(candidate as JourneyType) === -1
		? null
		: (candidate as JourneyType);
}

function splitList(value: string): string[] {
	return value
		.split(",")
		.map((entry) => entry.trim())
		.filter((entry) => entry.length > 0);
}

export function parseJourney(source: string): JourneyData | null {
	const lines = source
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length < 2) {
		return null;
	}

	const type = readType(lines[0]);

	if (type === null) {
		return null;
	}

	const name = lines[1];

	if (!name || name === CONSEQUENCES_KEYWORD || name.startsWith(VIGNETTE_PREFIX)) {
		return null;
	}

	const data: JourneyData = {
		type,
		name,
		description: [],
		tags: [],
		consequences: [],
		vignettes: [],
	};

	for (const line of lines.slice(2)) {
		if (line === CONSEQUENCES_KEYWORD) {
			continue;
		}

		if (line.startsWith(VIGNETTE_PREFIX)) {
			const rest = line.slice(VIGNETTE_PREFIX.length).trim();
			const index = rest.indexOf(TRIGGER_SEPARATOR);

			if (index === -1) {
				data.vignettes.push({ name: rest, consequences: [] });
			} else {
				data.vignettes.push({
					name: rest.slice(0, index).trim(),
					trigger: rest.slice(index + TRIGGER_SEPARATOR.length).trim(),
					consequences: [],
				});
			}

			continue;
		}

		// A consequence belongs to the open vignette, or to the shared list
		// while no vignette has started yet.
		if (line.startsWith(">")) {
			const consequence = line.slice(1).trim();

			if (!consequence) {
				continue;
			}

			const current = data.vignettes[data.vignettes.length - 1];

			if (current) {
				current.consequences.push(consequence);
			} else {
				data.consequences.push(consequence);
			}

			continue;
		}

		const lowered = line.toLowerCase();

		if (lowered.startsWith(TAGS_PREFIX)) {
			data.tags = splitList(line.slice(TAGS_PREFIX.length));
		} else if (lowered.startsWith(BENEFITS_PREFIX)) {
			data.benefits = line.slice(BENEFITS_PREFIX.length).trim();
		} else if (line.startsWith(":")) {
			data.description.push(line.slice(1).trim());
		}
	}

	return data;
}
