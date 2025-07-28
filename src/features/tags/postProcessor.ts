import { MarkdownPostProcessor, MarkdownPostProcessorContext } from "obsidian";
import { classifyTag } from "./classifyTag";

/**
 * Replaces tag patterns with spans in rendered markdown view
 */
export const brumesPostProcessor: MarkdownPostProcessor = (
	element: HTMLElement,
	context: MarkdownPostProcessorContext,
) => {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
	const textNodes: Text[] = [];

	let node;
	while ((node = walker.nextNode())) {
		textNodes.push(node as Text);
	}

	textNodes.forEach((textNode) => {
		const text = textNode.textContent || "";
		const regex = /\{([^}]+)\}/g;
		if (!regex.test(text)) return;

		const parent = textNode.parentNode;
		if (!parent) return;

		const fragment = document.createDocumentFragment();
		let lastIndex = 0;
		let match;

		regex.lastIndex = 0;
		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				fragment.appendChild(
					document.createTextNode(text.slice(lastIndex, match.index)),
				);
			}

			const content = match[1];
			const tagInfo = classifyTag(content);
			const span = document.createElement("span");
			span.className = tagInfo.className;

			if (tagInfo.type === "status") {
				span.dataset.statusName = tagInfo.name!;
				span.dataset.statusValue = tagInfo.value!;
				span.textContent = tagInfo.value
					? `${tagInfo.name}-${tagInfo.value}`
					: tagInfo.name!;
			} else if (tagInfo.type === "limit") {
				span.dataset.limitName = tagInfo.name!;
				span.dataset.limitValue = tagInfo.value!;
				span.textContent = tagInfo.name!;
			} else {
				span.dataset.name = tagInfo.name!;
				span.textContent = tagInfo.name!;
			}

			fragment.appendChild(span);
			lastIndex = match.index + match[0].length;
		}

		if (lastIndex < text.length) {
			fragment.appendChild(
				document.createTextNode(text.slice(lastIndex)),
			);
		}

		parent.replaceChild(fragment, textNode);
	});
};
