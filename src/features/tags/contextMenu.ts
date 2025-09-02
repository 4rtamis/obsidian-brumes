import { Menu, Editor } from "obsidian";

export function contributeTagInsertion(menu: Menu, editor: Editor) {
	menu.addItem((item) =>
		item
			.setTitle("Tag, status or limit")
			.setIcon("tag")
			.onClick(() => insertRandomTag(editor)),
	);
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
		ch: cursor.ch + 1, // after '{'
	};
	const to = {
		line: cursor.line,
		ch: cursor.ch + random.length - 1, // before '}'
	};
	editor.setSelection(from, to);
}
