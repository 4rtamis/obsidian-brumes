import { Menu, Editor } from "obsidian";
import { BrumesSettings } from "../../settings/types";

export function hasTagInsertion(settings: BrumesSettings): boolean {
	return settings.features.tagsSyntax;
}

export function contributeTagInsertion(
	menu: Menu,
	editor: Editor,
	settings: BrumesSettings,
): number {
	if (!hasTagInsertion(settings)) {
		return 0;
	}

	menu.addItem((item) =>
		item
			.setTitle("Tag, status or limit")
			.setIcon("tag")
			.onClick(() => insertRandomTag(editor)),
	);

	return 1;
}

function insertRandomTag(editor: Editor) {
	const variants = [
		`{example-tag}`,
		`{example-status-2}`,
		`{example-limit:5}`,
	];
	const random = variants[Math.floor(Math.random() * variants.length)];

	const cursor = editor.getCursor();
	editor.replaceRange(random, cursor);

	const from = {
		line: cursor.line,
		ch: cursor.ch + 1,
	};
	const to = {
		line: cursor.line,
		ch: cursor.ch + random.length - 1,
	};
	editor.setSelection(from, to);
}
