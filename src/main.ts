import {
	Plugin,
	MarkdownPostProcessor,
	MarkdownPostProcessorContext,
} from "obsidian";
import { Extension, EditorSelection } from "@codemirror/state";
import {
	EditorView,
	Decoration,
	DecorationSet,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

class HiddenBracketWidget extends WidgetType {
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

export default class BrumesPlugin extends Plugin {
	async onload() {
		this.registerEditorExtension(this.brumesEditorExtension());
		this.registerMarkdownPostProcessor(this.brumesPostProcessor);
		console.log("Brumes plugin loaded");
	}

	onunload() {
		console.log("Brumes plugin unloaded");
	}

	private brumesEditorExtension(): Extension {
		return ViewPlugin.fromClass(
			class {
				decorations: DecorationSet = Decoration.none;

				constructor(view: EditorView) {
					this.decorations = this.buildDecorations(view);
				}

				update(update: ViewUpdate) {
					if (
						update.docChanged ||
						update.viewportChanged ||
						update.selectionSet
					) {
						this.decorations = this.buildDecorations(update.view);
					}
				}

				buildDecorations(view: EditorView): DecorationSet {
					const builder = new RangeSetBuilder<Decoration>();
					const doc = view.state.doc;
					const selection = view.state.selection;

					for (let i = 1; i <= doc.lines; i++) {
						const line = doc.line(i);
						const text = line.text;
						const regex = /\{([^}]+)\}/g;
						let match;

						while ((match = regex.exec(text)) !== null) {
							const from = line.from + match.index;
							const to = from + match[0].length;
							const contentFrom = from + 1; // After opening brace
							const contentTo = to - 1; // Before closing brace

							// Check if cursor/selection touches this tag
							const isTouched = this.touchesSelection(
								selection,
								from,
								to,
							);

							if (isTouched) {
								// Show brackets and style content
								builder.add(
									contentFrom,
									contentTo,
									Decoration.mark({
										class: "brumes-tag-content",
									}),
								);
							} else {
								// Hide brackets and style content
								builder.add(
									from,
									from + 1,
									Decoration.replace({
										widget: new HiddenBracketWidget("{"),
									}),
								);
								builder.add(
									contentFrom,
									contentTo,
									Decoration.mark({
										class: "brumes-tag",
									}),
								);
								builder.add(
									contentTo,
									to,
									Decoration.replace({
										widget: new HiddenBracketWidget("}"),
									}),
								);
							}
						}
					}

					return builder.finish();
				}

				touchesSelection(
					selection: EditorSelection,
					from: number,
					to: number,
				): boolean {
					for (const range of selection.ranges) {
						if (range.from <= to && range.to >= from) {
							return true;
						}
					}
					return false;
				}
			},
			{
				decorations: (v) => v.decorations,
			},
		);
	}

	private brumesPostProcessor: MarkdownPostProcessor = (
		element: HTMLElement,
		context: MarkdownPostProcessorContext,
	) => {
		const walker = document.createTreeWalker(
			element,
			NodeFilter.SHOW_TEXT,
			null,
		);

		const textNodes: Text[] = [];
		let node;
		while ((node = walker.nextNode())) {
			textNodes.push(node as Text);
		}

		textNodes.forEach((textNode) => {
			const text = textNode.textContent || "";
			const regex = /\{([^}]+)\}/g;

			if (regex.test(text)) {
				const parent = textNode.parentNode;
				if (!parent) return;

				const fragment = document.createDocumentFragment();
				let lastIndex = 0;
				let match;

				regex.lastIndex = 0;
				while ((match = regex.exec(text)) !== null) {
					if (match.index > lastIndex) {
						fragment.appendChild(
							document.createTextNode(
								text.slice(lastIndex, match.index),
							),
						);
					}

					const span = document.createElement("span");
					span.className = "brumes-tag";
					span.textContent = match[1];
					fragment.appendChild(span);

					lastIndex = match.index + match[0].length;
				}

				if (lastIndex < text.length) {
					fragment.appendChild(
						document.createTextNode(text.slice(lastIndex)),
					);
				}

				parent.replaceChild(fragment, textNode);
			}
		});
	};
}
