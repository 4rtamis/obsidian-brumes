import { Editor, Menu } from "obsidian";
import { BrumesSettings } from "../../settings/types";

type CalloutTemplate =
	| {
			type: "title-body";
			title: string;
			body: string;
	  }
	| {
			type: "body-only";
			body: string;
	  };

interface CalloutInsertion {
	title: string;
	icon: string;
	alias: string;
	template: CalloutTemplate;
}

export function getAvailableCalloutInsertions(
	settings: BrumesSettings,
): CalloutInsertion[] {
	if (settings.mode === "city-of-mist") {
		return [
			buildCalloutInsertion(
				"Note callout",
				"sticky-note",
				settings.calloutAliases.cityOfMist.note[0],
				{
					type: "title-body",
					title: "Title of the note",
					body: "Content of the note",
				},
			),
			buildCalloutInsertion(
				"Move callout",
				"swords",
				settings.calloutAliases.cityOfMist.move[0],
				{
					type: "title-body",
					title: "Name of the move",
					body: "Describe the move",
				},
			),
			buildCalloutInsertion(
				"Description callout",
				"scroll-text",
				settings.calloutAliases.cityOfMist.description[0],
				{
					type: "body-only",
					body: "Text to read aloud",
				},
			),
			buildCalloutInsertion(
				"Clue callout",
				"search",
				settings.calloutAliases.cityOfMist.clue[0],
				{
					type: "body-only",
					body: "Clue text",
				},
			),
			buildCalloutInsertion(
				"Red clue callout",
				"badge-alert",
				settings.calloutAliases.cityOfMist.redClue[0],
				{
					type: "body-only",
					body: "Red herring clue",
				},
			),
		].filter((item): item is CalloutInsertion => item !== null);
	}

	if (settings.mode === "legend-in-the-mist") {
		return [
			buildCalloutInsertion(
				"Note callout",
				"sticky-note",
				settings.calloutAliases.legendInTheMist.note[0],
				{
					type: "title-body",
					title: "Title of the note",
					body: "Content of the note",
				},
			),
			buildCalloutInsertion(
				"Read-aloud callout",
				"mic",
				settings.calloutAliases.legendInTheMist.readAloud[0],
				{
					type: "body-only",
					body: "Text to read aloud",
				},
			),
		].filter((item): item is CalloutInsertion => item !== null);
	}

	return [];
}

export function contributeCalloutInsertions(
	menu: Menu,
	editor: Editor,
	settings: BrumesSettings,
): number {
	const callouts = getAvailableCalloutInsertions(settings);

	for (const callout of callouts) {
		menu.addItem((item) =>
			item
				.setTitle(callout.title)
				.setIcon(callout.icon)
				.onClick(() => insertCallout(editor, callout)),
		);
	}

	return callouts.length;
}

function buildCalloutInsertion(
	title: string,
	icon: string,
	alias: string | undefined,
	template: CalloutTemplate,
): CalloutInsertion | null {
	if (!alias) {
		return null;
	}

	return {
		title,
		icon,
		alias,
		template,
	};
}

function insertCallout(editor: Editor, callout: CalloutInsertion) {
	const cursor = editor.getCursor();

	if (callout.template.type === "title-body") {
		const line1 = `> [!${callout.alias.toUpperCase()}] ${callout.template.title}`;
		const line2 = `> ${callout.template.body}`;
		editor.replaceRange(`${line1}\n${line2}`, cursor);

		const line = cursor.line;
		const startCh = line1.indexOf(callout.template.title);
		const endCh = startCh + callout.template.title.length;
		editor.setSelection({ line, ch: startCh }, { line, ch: endCh });
		return;
	}

	const line1 = `> [!${callout.alias.toUpperCase()}]`;
	const line2 = `> ${callout.template.body}`;
	editor.replaceRange(`${line1}\n${line2}`, cursor);

	const line = cursor.line + 1;
	const startCh = line2.indexOf(callout.template.body);
	const endCh = startCh + callout.template.body.length;
	editor.setSelection({ line, ch: startCh }, { line, ch: endCh });
}
