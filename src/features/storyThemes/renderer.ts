import { StoryThemeData } from "./parser";

export function renderStoryTheme(data: StoryThemeData): HTMLElement {
	const container = document.createElement("div");
	container.classList.add("brumes-story-theme", `level--${data.level}`);

	if (data.category) {
		const category = document.createElement("div");
		category.classList.add("story-theme__category");
		category.textContent = data.category.toUpperCase();
		container.appendChild(category);
	}

	const title = document.createElement("div");
	title.classList.add("story-theme__title");
	title.textContent = data.titleTag;
	container.appendChild(title);

	const tagList = document.createElement("ul");
	tagList.classList.add("story-theme__tags");

	// Title tag as the first power tag
	const titleTag = document.createElement("li");
	titleTag.classList.add("tag", "tag--title");
	titleTag.textContent = data.titleTag;
	tagList.appendChild(titleTag);

	for (const tag of data.powerTags) {
		const li = document.createElement("li");
		li.classList.add("tag", "tag--power");
		li.textContent = tag;
		tagList.appendChild(li);
	}

	for (const tag of data.weaknessTags) {
		const li = document.createElement("li");
		li.classList.add("tag", "tag--weakness");
		li.textContent = tag;
		tagList.appendChild(li);
	}

	container.appendChild(tagList);
	return container;
}
