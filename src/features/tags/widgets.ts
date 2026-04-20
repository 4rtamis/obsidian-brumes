import { WidgetType } from "@codemirror/view";

/**
 * A widget that hides specific characters (e.g. `{`, `}`, `!`, `-`) from view.
 */
export class HiddenBracketWidget extends WidgetType {
	// eslint-disable-next-line obsidianmd/prefer-active-doc
	constructor(private text: string) {
		super();
	}
	toDOM(): HTMLElement {
		const span = activeDocument.createElement("span");
		span.hidden = true;
		span.textContent = this.text;
		return span;
	}
}
