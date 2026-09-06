import { classifyTag } from "../tags/classifyTag";

/** Bypass the classifier when the block grammar already knows the kind. */
export type ForcedTagKind = "power" | "weakness";

export interface TagSpanOptions {
	force?: ForcedTagKind;
}

/**
 * Build a tag span the stylesheet can read. The data attributes below are the
 * contract `_tags.scss` relies on, so every card builds its tags here rather
 * than by hand.
 */
export function renderTagSpan(
	content: string,
	doc: Document,
	options: TagSpanOptions = {},
): HTMLSpanElement {
	const span = doc.createElement("span");

	if (options.force) {
		span.className = `brumes-tag brumes-${options.force}`;
		span.dataset.name = content;
		span.textContent = content;
		return span;
	}

	const tagInfo = classifyTag(content);
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

	return span;
}

/**
 * Build a limit span from a name and a rating held apart. Parsers keep the two
 * fields separate; the `name:rating` syntax the classifier expects lives here.
 */
export function renderRatedLimit(
	name: string,
	rating: string,
	doc: Document,
): HTMLSpanElement {
	return renderTagSpan(`${name.trim()}:${rating.trim()}`, doc);
}
