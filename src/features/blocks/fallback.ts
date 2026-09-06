/**
 * Output a fenced block as plain code, the way Obsidian would have without
 * a registered processor. Used whenever a block is off or out of its mode.
 */
export function renderRawBlock(
	source: string,
	el: HTMLElement,
	language: string,
): void {
	const doc = el.doc;
	const pre = doc.createElement("pre");
	const code = doc.createElement("code");
	code.className = `language-${language}`;
	code.textContent = source;
	pre.appendChild(code);
	el.appendChild(pre);
}
