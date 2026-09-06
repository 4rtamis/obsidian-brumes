export interface ChallengeLimit {
	name: string;
	rating: string;
	consequence?: string;
}

export interface ChallengeMight {
	aspect: string;
	vulnerability?: string;
}

export interface ChallengeFeature {
	name: string;
	effect: string;
}

export interface ChallengeThreat {
	name: string;
	trigger?: string;
	consequences: string[];
}

export interface ChallengeSecret {
	label: string;
	text: string;
}

export interface ChallengeData {
	name: string;
	roles: string[];
	description: string[];
	limits: ChallengeLimit[];
	might?: ChallengeMight;
	tags: string[];
	features: ChallengeFeature[];
	threats: ChallengeThreat[];
	secrets: ChallengeSecret[];
}

type Section = "limits" | "might" | "tags" | "features" | "threats" | "secrets";

/** Uppercase keywords opening a section, as printed in the challenge profiles. */
const SECTIONS: Record<string, Section> = {
	LIMITS: "limits",
	MIGHT: "might",
	TAGS: "tags",
	FEATURES: "features",
	THREATS: "threats",
	SECRETS: "secrets",
};

const ROLES_PREFIX = "roles:";
const CONSEQUENCE_SEPARATOR = " > ";
const TRIGGER_SEPARATOR = " : ";
const MIGHT_PATTERN = /^(.*?)\s*\(([^)]*)\)\s*$/;
const LIMIT_PATTERN = /^(.*?)\s+(\d+|~|-)$/;
const TAG_PATTERN = /\{([^}]*)\}|(\S+)/g;

/** Split a line into what it is about and the consequence trailing a `>`. */
function splitConsequence(line: string): [string, string | undefined] {
	const index = line.indexOf(CONSEQUENCE_SEPARATOR);

	if (index === -1) {
		return [line.trim(), undefined];
	}

	return [
		line.slice(0, index).trim(),
		line.slice(index + CONSEQUENCE_SEPARATOR.length).trim(),
	];
}

/** A tag run mixes braced multi-word tags and bare single-word ones. */
function parseTagRun(line: string): string[] {
	const tags: string[] = [];
	let match = TAG_PATTERN.exec(line);

	while (match !== null) {
		const tag = (match[1] ?? match[2] ?? "").trim();

		if (tag) {
			tags.push(tag);
		}

		match = TAG_PATTERN.exec(line);
	}

	TAG_PATTERN.lastIndex = 0;
	return tags;
}

function parseLimit(line: string): ChallengeLimit {
	const [subject, consequence] = splitConsequence(line);
	const match = LIMIT_PATTERN.exec(subject);
	const limit: ChallengeLimit = match
		? { name: match[1].trim(), rating: match[2] }
		: { name: subject, rating: "" };

	if (consequence) {
		limit.consequence = consequence;
	}

	return limit;
}

function parseMight(line: string): ChallengeMight {
	const match = MIGHT_PATTERN.exec(line);

	if (!match) {
		return { aspect: line };
	}

	const vulnerability = match[2].trim();

	return vulnerability
		? { aspect: match[1].trim(), vulnerability }
		: { aspect: match[1].trim() };
}

export function parseChallenge(source: string): ChallengeData | null {
	const lines = source
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	if (lines.length === 0 || SECTIONS[lines[0].toUpperCase()]) {
		return null;
	}

	const data: ChallengeData = {
		name: lines[0],
		roles: [],
		description: [],
		limits: [],
		tags: [],
		features: [],
		threats: [],
		secrets: [],
	};

	let section: Section | null = null;
	let sectionsSeen = 0;

	for (const line of lines.slice(1)) {
		const keyword = SECTIONS[line.toUpperCase()];

		if (keyword) {
			section = keyword;
			sectionsSeen++;
			continue;
		}

		if (section === null) {
			if (line.toLowerCase().startsWith(ROLES_PREFIX)) {
				data.roles = line
					.slice(ROLES_PREFIX.length)
					.split(",")
					.map((role) => role.trim())
					.filter((role) => role.length > 0);
			} else if (line.startsWith(":")) {
				data.description.push(line.slice(1).trim());
			}

			continue;
		}

		if (section === "limits") {
			data.limits.push(parseLimit(line));
		} else if (section === "might") {
			data.might = parseMight(line);
		} else if (section === "tags") {
			data.tags.push(...parseTagRun(line));
		} else if (section === "features") {
			const [name, effect] = splitConsequence(line);
			data.features.push({ name, effect: effect ?? "" });
		} else if (section === "threats") {
			appendThreatLine(data.threats, line);
		} else if (section === "secrets") {
			const separator = line.indexOf(":");

			if (separator === -1) {
				data.secrets.push({ label: "", text: line });
			} else {
				data.secrets.push({
					label: line.slice(0, separator).trim(),
					text: line.slice(separator + 1).trim(),
				});
			}
		}
	}

	return sectionsSeen > 0 ? data : null;
}

/** A threat opens on its own line, then owns every `>` line below it. */
function appendThreatLine(threats: ChallengeThreat[], line: string): void {
	if (line.startsWith(">")) {
		const consequence = line.slice(1).trim();
		const current = threats[threats.length - 1];

		if (current && consequence) {
			current.consequences.push(consequence);
		}

		return;
	}

	const index = line.indexOf(TRIGGER_SEPARATOR);

	if (index === -1) {
		threats.push({ name: line, consequences: [] });
		return;
	}

	threats.push({
		name: line.slice(0, index).trim(),
		trigger: line.slice(index + TRIGGER_SEPARATOR.length).trim(),
		consequences: [],
	});
}
