import { renderTagSpan } from "../blocks/tagSpan";
import { ThemeKitData } from "./parser";

function addTagList(
	container: HTMLElement,
	doc: Document,
	name: string,
	tags: string[],
	force: "power" | "weakness",
): void {
	if (tags.length === 0) {
		return;
	}

	const list = doc.createElement("ul");
	list.classList.add("brumes-theme-kit--tags", `brumes-theme-kit--${name}`);

	for (const tag of tags) {
		const item = doc.createElement("li");
		item.appendChild(renderTagSpan(tag, doc, { force }));
		list.appendChild(item);
	}

	container.appendChild(list);
}

export function renderThemeKit(data: ThemeKitData, doc: Document): HTMLElement {
	const container = doc.createElement("div");
	container.classList.add("brumes-theme-kit");

	if (data.category) {
		const category = doc.createElement("div");
		category.classList.add("brumes-theme-kit--category");
		category.textContent = data.category.toUpperCase();
		container.appendChild(category);
	}

	const name = doc.createElement("div");
	name.classList.add("brumes-theme-kit--name");
	name.textContent = data.name;
	container.appendChild(name);

	addTagList(container, doc, "power-tags", data.powerTags, "power");
	addTagList(container, doc, "weakness-tags", data.weaknessTags, "weakness");

	if (data.quest) {
		const quest = doc.createElement("div");
		quest.classList.add("brumes-theme-kit--quest");
		quest.textContent = data.quest;
		container.appendChild(quest);
	}

	if (data.improvement) {
		const improvement = doc.createElement("div");
		improvement.classList.add("brumes-theme-kit--improvement");

		const name = doc.createElement("span");
		name.classList.add("brumes-theme-kit--improvement-name");
		name.textContent = data.improvement.name;
		improvement.appendChild(name);

		if (data.improvement.effect) {
			const effect = doc.createElement("span");
			effect.classList.add("brumes-theme-kit--improvement-effect");
			effect.textContent = data.improvement.effect;
			improvement.appendChild(effect);
		}

		container.appendChild(improvement);
	}

	return container;
}
