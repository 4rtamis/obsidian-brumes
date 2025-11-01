export type TagInfo = {
	type: "status" | "limit" | "power" | "weakness";
	className: string;
	name?: string;
	value?: string;
};

/**
 * Determines the type of tag and returns structured information.
 */
export function classifyTag(content: string): TagInfo {
	// Weakness tags: start with "!" followed by any content
	// Examples: "{!Afraid}", "{!Injured}", "{!Broken Equipment}"
	if (/^!(.+)$/.test(content)) {
		const [, name] = content.match(/^!(.+)$/)!;
		return {
			type: "weakness",
			className: "brumes-weakness",
			name,
		};
	}

	// Status tags: any content followed by "-" and optional digits
	// Examples: "{Hurt-3}", "{Tired-}", "{Bleeding-2}", "{Confused-1}"
	if (/^(.*?)-(\d*)$/.test(content)) {
		const [, name, value] = content.match(/^(.*?)-(\d*)$/)!;
		return {
			type: "status",
			className: "brumes-status",
			name,
			value,
		};
	}

	// Limit tags: any content followed by ":" and optional digits
	// Examples: "{Stress:4}", "{Health:}", "{Sanity:2}", "{Focus:3}"
	if (/^(.*?):(\d*)$/.test(content)) {
		const [, name, value] = content.match(/^(.*?):(\d*)$/)!;
		return {
			type: "limit",
			className: "brumes-limit",
			name,
			value,
		};
	}

	// Power tags: anything that doesn't match the above patterns
	// Examples: "{Acrobatics}", "{Investigation}", "{Firearms}", "{Street Smart}"
	return {
		type: "power",
		className: "brumes-power",
		name: content,
	};
}
