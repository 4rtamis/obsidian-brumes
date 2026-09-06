import { renderRatedLimit, renderTagSpan } from "../blocks/tagSpan";
import { ChallengeData } from "./parser";

/** Open a card section, its heading carrying the printed profile wording. */
function addSection(
	container: HTMLElement,
	doc: Document,
	name: string,
	title: string,
): HTMLElement {
	const section = doc.createElement("section");
	section.classList.add("brumes-challenge--section", `brumes-challenge--${name}`);

	const heading = doc.createElement("h4");
	heading.classList.add("brumes-challenge--section-title");
	heading.textContent = title;
	section.appendChild(heading);

	container.appendChild(section);
	return section;
}

function addList(section: HTMLElement, doc: Document, name: string): HTMLElement {
	const list = doc.createElement("ul");
	list.classList.add(`brumes-challenge--${name}-list`);
	section.appendChild(list);
	return list;
}

function addLine(
	parent: HTMLElement,
	doc: Document,
	className: string,
	text: string,
): HTMLElement {
	const line = doc.createElement("div");
	line.classList.add(className);
	line.textContent = text;
	parent.appendChild(line);
	return line;
}

export function renderChallenge(
	data: ChallengeData,
	doc: Document,
): HTMLElement {
	const container = doc.createElement("div");
	container.classList.add("brumes-challenge");

	const header = doc.createElement("header");
	header.classList.add("brumes-challenge--header");
	addLine(header, doc, "brumes-challenge--name", data.name);

	if (data.roles.length > 0) {
		addLine(
			header,
			doc,
			"brumes-challenge--roles",
			data.roles.join(", "),
		);
	}

	container.appendChild(header);

	if (data.description.length > 0) {
		const description = doc.createElement("section");
		description.classList.add(
			"brumes-challenge--section",
			"brumes-challenge--description",
		);

		for (const paragraph of data.description) {
			const p = doc.createElement("p");
			p.textContent = paragraph;
			description.appendChild(p);
		}

		container.appendChild(description);
	}

	if (data.limits.length > 0) {
		const section = addSection(container, doc, "limits", "Limits");
		const list = addList(section, doc, "limit");

		for (const limit of data.limits) {
			const item = doc.createElement("li");
			item.classList.add("brumes-challenge--limit");
			item.appendChild(renderRatedLimit(limit.name, limit.rating, doc));

			if (limit.consequence) {
				addLine(
					item,
					doc,
					"brumes-challenge--limit-consequence",
					limit.consequence,
				);
			}

			list.appendChild(item);
		}
	}

	if (data.might) {
		const section = addSection(container, doc, "might", "Might");
		const aspect = addLine(
			section,
			doc,
			"brumes-challenge--might-aspect",
			data.might.aspect,
		);

		if (data.might.vulnerability) {
			const vulnerability = doc.createElement("span");
			vulnerability.classList.add("brumes-challenge--might-vulnerability");
			vulnerability.textContent = data.might.vulnerability;
			aspect.appendChild(vulnerability);
		}
	}

	if (data.tags.length > 0) {
		const section = addSection(container, doc, "tags", "Tags & statuses");
		const list = addList(section, doc, "tag");

		for (const tag of data.tags) {
			const item = doc.createElement("li");
			item.appendChild(renderTagSpan(tag, doc));
			list.appendChild(item);
		}
	}

	if (data.features.length > 0) {
		const section = addSection(container, doc, "features", "Special features");
		const list = addList(section, doc, "feature");

		for (const feature of data.features) {
			const item = doc.createElement("li");
			item.classList.add("brumes-challenge--feature");

			const name = doc.createElement("span");
			name.classList.add("brumes-challenge--feature-name");
			name.textContent = feature.name;
			item.appendChild(name);

			if (feature.effect) {
				const effect = doc.createElement("span");
				effect.classList.add("brumes-challenge--feature-effect");
				effect.textContent = feature.effect;
				item.appendChild(effect);
			}

			list.appendChild(item);
		}
	}

	if (data.threats.length > 0) {
		const section = addSection(
			container,
			doc,
			"threats",
			"Threats & consequences",
		);
		const list = addList(section, doc, "threat");

		for (const threat of data.threats) {
			const item = doc.createElement("li");
			item.classList.add("brumes-challenge--threat");
			addLine(item, doc, "brumes-challenge--threat-name", threat.name);

			if (threat.trigger) {
				addLine(
					item,
					doc,
					"brumes-challenge--threat-trigger",
					threat.trigger,
				);
			}

			if (threat.consequences.length > 0) {
				const consequences = doc.createElement("ul");
				consequences.classList.add("brumes-challenge--consequence-list");

				for (const consequence of threat.consequences) {
					const line = doc.createElement("li");
					line.classList.add("brumes-challenge--consequence");
					line.textContent = consequence;
					consequences.appendChild(line);
				}

				item.appendChild(consequences);
			}

			list.appendChild(item);
		}
	}

	if (data.secrets.length > 0) {
		const section = addSection(container, doc, "secrets", "Secrets");
		const list = addList(section, doc, "secret");

		for (const secret of data.secrets) {
			const item = doc.createElement("li");
			item.classList.add("brumes-challenge--secret");

			if (secret.label) {
				const label = doc.createElement("span");
				label.classList.add("brumes-challenge--secret-label");
				label.textContent = secret.label;
				item.appendChild(label);
			}

			const text = doc.createElement("span");
			text.classList.add("brumes-challenge--secret-text");
			text.textContent = secret.text;
			item.appendChild(text);

			list.appendChild(item);
		}
	}

	return container;
}
