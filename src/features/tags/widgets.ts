import { WidgetType } from "@codemirror/view";

/**
 * A widget that hides specific characters (e.g. `{`, `}`, `!`, `-`) from view.
 */
export class HiddenBracketWidget extends WidgetType {
	constructor(private text: string) {
		super();
	}
	toDOM(): HTMLElement {
		const span = document.createElement("span");
		span.style.display = "none";
		span.textContent = this.text;
		return span;
	}
}
