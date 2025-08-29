import { StoryThemeData } from "./parser";
import { logScope } from "../../utils/logger";
import { title } from "process";

const log = logScope("StoryTheme");

export function renderStoryTheme(data: StoryThemeData): HTMLElement {
	const container = document.createElement("div");
	container.classList.add(
		"brumes-story-theme",
		`brumes-story-theme--might-${data.level}`,
	);

	if (data.category) {
		const category = document.createElement("div");
		category.classList.add("brumes-story-theme--category");
		category.textContent = data.category.toUpperCase();
		container.appendChild(category);
	}

	// Title tag as the first power tag
	const titleBox = document.createElement("div");
	titleBox.classList.add("brumes-story-theme--title-box");
	const titleTag = document.createElement("span");
	titleTag.classList.add("brumes-story-theme--title");
	titleTag.textContent = data.titleTag;
	titleBox.appendChild(titleTag);
	container.appendChild(titleBox);

	const tagList = document.createElement("ul");
	tagList.classList.add("brumes-story-theme--tags");

	for (const tag of data.powerTags) {
		const li = document.createElement("li");
		const span = document.createElement("span");
		span.classList.add("brumes-tag", "brumes-power");
		span.dataset.name = tag;
		span.textContent = tag;
		tagList.appendChild(li.appendChild(span));
	}

	for (const tag of data.weaknessTags) {
		const li = document.createElement("li");
		const span = document.createElement("span");
		span.classList.add("brumes-tag", "brumes-weakness");
		span.dataset.name = tag;
		span.textContent = tag;
		tagList.appendChild(li.appendChild(span));
	}

	container.appendChild(tagList);
	return container;
}
