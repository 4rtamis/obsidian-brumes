import { renderTagSpan } from "../blocks/tagSpan";
import { ThemeCardData } from "./parser";

export function renderThemeCard(
	data: ThemeCardData,
	doc: Document,
): HTMLElement {
	const container = doc.createElement("div");
	container.classList.add(
		"brumes-story-theme",
		`brumes-story-theme--might-${data.level}`,
	);

	if (data.category) {
		const category = doc.createElement("div");
		category.classList.add("brumes-story-theme--category");
		category.textContent = data.category.toUpperCase();
		container.appendChild(category);
	}

	// Title tag as the first power tag
	const titleBox = doc.createElement("div");
	titleBox.classList.add("brumes-story-theme--title-box");
	const titleTag = doc.createElement("span");
	titleTag.classList.add("brumes-story-theme--title");
	titleTag.dataset.name = data.titleTag;
	titleTag.textContent = data.titleTag;
	titleBox.appendChild(titleTag);
	container.appendChild(titleBox);

	const tagList = doc.createElement("ul");
	tagList.classList.add("brumes-story-theme--tags");

	for (const tag of data.powerTags) {
		const li = doc.createElement("li");
		li.appendChild(renderTagSpan(tag, doc, { force: "power" }));
		tagList.appendChild(li);
	}

	for (const tag of data.weaknessTags) {
		const li = doc.createElement("li");
		li.appendChild(renderTagSpan(tag, doc, { force: "weakness" }));
		tagList.appendChild(li);
	}

	container.appendChild(tagList);
	return container;
}
