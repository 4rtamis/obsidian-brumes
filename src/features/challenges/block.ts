import { BrumesBlock } from "../blocks/types";
import { ChallengeData, parseChallenge } from "./parser";
import { renderChallenge } from "./renderer";

function challengeTemplate(): string {
	return [
		"```litm-challenge",
		"{Challenge name}",
		"roles: role, role",
		": What this challenge is, in one line.",
		"LIMITS",
		"Limit 2",
		"Progress limit 4 > What happens when it fills.",
		"MIGHT",
		"Aspect (vulnerability)",
		"TAGS",
		"{a tag} status-2",
		"FEATURES",
		"Feature name > What it does.",
		"THREATS",
		"Threat : When it triggers.",
		"> A consequence (effect)",
		"SECRETS",
		"Label: What the narrator knows.",
		"```",
		"",
	].join("\n");
}

export const challengeBlock: BrumesBlock<ChallengeData> = {
	id: "litm-challenge",
	mode: "legend-in-the-mist",
	flag: "challengeParser",
	label: "Challenge",
	icon: "swords",
	parse: parseChallenge,
	render: renderChallenge,
	template: challengeTemplate,
};
