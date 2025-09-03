import { Menu, Editor } from "obsidian";

export function contributeCalloutInsertions(menu: Menu, editor: Editor) {
	// Insert [!NOTE] block
	menu.addItem((item) =>
		item
			.setTitle("Note callout")
			.setIcon("sticky-note")
			.onClick(() => insertNoteCallout(editor)),
	);

	// Insert [!READ-ALOUD] block
	menu.addItem((item) =>
		item
			.setTitle("Read-aloud callout")
			.setIcon("mic")
			.onClick(() => insertReadAloudCallout(editor)),
	);
}

// Insert [!NOTE] Title of the note\n> Content
function insertNoteCallout(editor: Editor) {
	const cursor = editor.getCursor();

	const line1 = "> [!NOTE] Title of the note";
	const line2 = "> Content of the note";

	const block = `${line1}\n${line2}`;
	editor.replaceRange(block, cursor);

	// Select "Title of the note"
	const line = cursor.line;
	const startCh = line1.indexOf("Title of the note");
	const endCh = startCh + "Title of the note".length;

	editor.setSelection({ line, ch: startCh }, { line, ch: endCh });
}

// Insert [!READ-ALOUD]\n> Text to read aloud
function insertReadAloudCallout(editor: Editor) {
	const cursor = editor.getCursor();

	const line1 = "> [!READ-ALOUD]";
	const line2 = "> Text to read aloud";

	const block = `${line1}\n${line2}`;
	editor.replaceRange(block, cursor);

	// Select "Text to read aloud"
	const line = cursor.line + 1;
	const startCh = line2.indexOf("Text to read aloud");
	const endCh = startCh + "Text to read aloud".length;

	editor.setSelection({ line, ch: startCh }, { line, ch: endCh });
}
