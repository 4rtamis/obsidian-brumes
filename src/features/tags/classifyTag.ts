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
	if (/^!(.+)$/.test(content)) {
		const [, name] = content.match(/^!(.+)$/)!;
		return {
			type: "weakness",
			className: "brumes-weakness",
			name,
		};
	}
	if (/^(.*?)-(\d*)$/.test(content)) {
		const [, name, value] = content.match(/^(.*?)-(\d*)$/)!;
		return {
			type: "status",
			className: "brumes-status",
			name,
			value,
		};
	}
	if (/^(.*?):(\d*)$/.test(content)) {
		const [, name, value] = content.match(/^(.*?):(\d*)$/)!;
		return {
			type: "limit",
			className: "brumes-limit",
			name,
			value,
		};
	}
	return {
		type: "power",
		className: "brumes-power",
		name: content,
	};
}
