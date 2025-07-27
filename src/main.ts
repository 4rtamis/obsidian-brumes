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

	private classifyTag(content: string): {
		type: "status" | "limit" | "tag" | "weakness";
		className: string;
		name?: string;
		value?: string;
	} {
		if (/^!(.+)$/.test(content)) {
			const [, name] = content.match(/^!(.+)$/)!;
			return {
				type: "weakness",
				className: "brumes-weakness",
				name,
			};
		}
		if (/^(.*?)-(\d*)$/.test(content)) {
			const [, name, value] = content.match(/^(.*?)-(\d*)$/)!;
			return {
				type: "status",
				className: "brumes-status",
				name,
				value,
			};
		}
		if (/^(.*?):(\d*)$/.test(content)) {
			const [, name, value] = content.match(/^(.*?):(\d*)$/)!;
			return {
				type: "limit",
				className: "brumes-limit",
				name,
				value,
			};
		}
		return { type: "tag", className: "brumes-tag", name: content };
	}

	private brumesEditorExtension(): Extension {
		const classifyTag = this.classifyTag.bind(this);

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
							const content = match[1];
							const contentFrom = from + 1;
							const contentTo = to - 1;

							const isTouched = this.touchesSelection(
								selection,
								from,
								to,
							);

							const tagInfo = classifyTag(content);

							if (isTouched) {
								builder.add(
									contentFrom,
									contentTo,
									Decoration.mark({
										class: `${tagInfo.className}-content`,
									}),
								);
							} else {
								builder.add(
									from,
									from + 1,
									Decoration.replace({
										widget: new HiddenBracketWidget("{"),
									}),
								);

								if (tagInfo.type === "status") {
									const endHyphenIndex =
										content.lastIndexOf("-");
									const name = tagInfo.name!;
									const value = tagInfo.value!;
									const nameFrom = contentFrom;
									const nameTo = contentFrom + endHyphenIndex;
									const valueFrom = nameTo + 1;
									const valueTo = contentTo;

									builder.add(
										nameFrom,
										valueTo,
										Decoration.mark({
											attributes: {
												class: tagInfo.className,
												"data-status-name": name,
												"data-status-value": value,
											},
										}),
									);

									if (value === "") {
										builder.add(
											nameTo,
											nameTo + 1,
											Decoration.replace({
												widget: new HiddenBracketWidget(
													"-",
												),
											}),
										);
									}
								} else if (tagInfo.type === "limit") {
									const colonIndex = content.lastIndexOf(":");
									const name = tagInfo.name!;
									const value = tagInfo.value!;
									const nameFrom = contentFrom;
									const nameTo = contentFrom + colonIndex;
									const valueFrom = nameTo + 1;
									const valueTo = contentTo;

									builder.add(
										nameFrom,
										valueTo,
										Decoration.mark({
											attributes: {
												class: tagInfo.className,
												"data-limit-name": name,
												"data-limit-value": value,
											},
										}),
									);

									builder.add(
										nameTo,
										valueTo,
										Decoration.replace({
											widget: new HiddenBracketWidget(
												content.slice(colonIndex),
											),
										}),
									);
								} else if (tagInfo.type === "weakness") {
									const name = tagInfo.name!;
									const bangIndex = content.indexOf("!");
									const nameStart =
										contentFrom + bangIndex + 1; // skip "!"
									const nameEnd = contentTo;

									// Hide "!" when not selected
									builder.add(
										contentFrom + bangIndex,
										contentFrom + bangIndex + 1,
										Decoration.replace({
											widget: new HiddenBracketWidget(
												"!",
											),
										}),
									);

									builder.add(
										nameStart,
										nameEnd,
										Decoration.mark({
											attributes: {
												class: tagInfo.className,
												"data-name": name,
											},
										}),
									);
								} else {
									builder.add(
										contentFrom,
										contentTo,
										Decoration.mark({
											attributes: {
												class: tagInfo.className,
												"data-name": tagInfo.name!,
											},
										}),
									);
								}

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
		const classifyTag = this.classifyTag;

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

					const content = match[1];
					const tagInfo = classifyTag(content);
					const span = document.createElement("span");
					span.className = tagInfo.className;

					if (tagInfo.type === "status") {
						span.dataset.statusName = tagInfo.name!;
						span.dataset.statusValue = tagInfo.value!;
						span.textContent =
							tagInfo.value === ""
								? `${tagInfo.name}`
								: `${tagInfo.name}-${tagInfo.value}`;
					} else if (tagInfo.type === "limit") {
						span.dataset.limitName = tagInfo.name!;
						span.dataset.limitValue = tagInfo.value!;
						span.textContent = tagInfo.name!;
					} else if (tagInfo.type === "weakness") {
						span.dataset.name = tagInfo.name!;
						span.textContent = tagInfo.name!;
					} else {
						span.dataset.name = tagInfo.name!;
						span.textContent = tagInfo.name!;
					}

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
