import { MarkdownPostProcessor, MarkdownPostProcessorContext } from "obsidian";
import { classifyTag } from "./classifyTag";
import { logScope } from "../../utils/logger";

const tagLog = logScope("Tags");

/**
 * Replaces tag patterns with spans in rendered markdown view.
 */
export function brumesPostProcessor(
	isEnabled: () => boolean,
): MarkdownPostProcessor {
	return (
		element: HTMLElement,
		context: MarkdownPostProcessorContext,
	) => {
		if (!isEnabled()) {
			return;
		}

		tagLog.debug("Running markdown post processor", { context });

		const doc = element.doc;
		const walker = doc.createTreeWalker(element, NodeFilter.SHOW_TEXT);
		const textNodes: Text[] = [];

		let node: Node | null = null;
		while ((node = walker.nextNode()) !== null) {
			if (isTextNode(node)) {
				textNodes.push(node);
			}
		}

		let processedCount = 0;

		textNodes.forEach((textNode) => {
			const text = textNode.textContent || "";
			const regex = /\{([^}]+)\}/g;
			if (!regex.test(text)) return;

			const parent = textNode.parentNode;
			if (!parent) {
				tagLog.warn("Skipped text node without parent:", textNode);
				return;
			}

			const fragment = doc.createDocumentFragment();
			let lastIndex = 0;
			let match;

			regex.lastIndex = 0;
			while ((match = regex.exec(text)) !== null) {
				const content = match[1];
				let tagInfo;

				try {
					tagInfo = classifyTag(content);
				} catch (err) {
					tagLog.error("Failed to classify tag:", content, err);
					continue;
				}

				tagLog.debug("Tag matched in rendered view", { content, tagInfo });

				if (match.index > lastIndex) {
					fragment.appendChild(
						doc.createTextNode(text.slice(lastIndex, match.index)),
					);
				}

				const span = doc.createElement("span");
				span.className = `brumes-tag ${tagInfo.className}`;

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
				processedCount++;
			}

			if (lastIndex < text.length) {
				fragment.appendChild(
					doc.createTextNode(text.slice(lastIndex)),
				);
			}

			parent.replaceChild(fragment, textNode);
		});

		if (processedCount > 0) {
			tagLog.info(`Post-processed ${processedCount} tag(s) in markdown view`);
		}
	};
}

function isTextNode(node: Node): node is Text {
	return node.nodeType === Node.TEXT_NODE;
}
