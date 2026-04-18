import {
	EditorView,
	Decoration,
	DecorationSet,
	ViewPlugin,
	ViewUpdate,
} from "@codemirror/view";
import { EditorSelection, Extension, RangeSetBuilder } from "@codemirror/state";
import { HiddenBracketWidget } from "./widgets";
import { classifyTag } from "./classifyTag";
import { logScope } from "../../utils/logger";

const tagLog = logScope("Tags");

/**
 * Builds the CodeMirror plugin that decorates tag patterns like {status-3}, {!fear}, etc.
 */
export function brumesEditorExtension(isEnabled: () => boolean): Extension {
		return ViewPlugin.fromClass(
			class {
				decorations: DecorationSet = Decoration.none;

				// eslint-disable-next-line obsidianmd/prefer-active-doc
				constructor(view: EditorView) {
					tagLog.info("Initialized editor decorations for view");
					this.decorations = this.buildDecorations(view);
			}

			update(update: ViewUpdate) {
				if (
					update.docChanged ||
					update.viewportChanged ||
					update.selectionSet
				) {
					tagLog.debug("Document, viewport or selection changed");
					this.decorations = this.buildDecorations(update.view);
				}
			}

			private buildDecorations(view: EditorView): DecorationSet {
				if (!isEnabled()) {
					return Decoration.none;
				}

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

						let tagInfo;
						try {
							tagInfo = classifyTag(content);
						} catch (err) {
							tagLog.error(
								"Failed to classify tag:",
								content,
								err,
							);
							continue;
						}
						tagLog.debug("Tag matched", {
							content,
							tagInfo,
							line: i,
							from,
							to,
						});

						// If user is selecting the tag, show everything including brackets.
						if (isTouched) {
							builder.add(
								contentFrom,
								contentTo,
								Decoration.mark({
									class: `brumes-tag-content ${tagInfo.className}-content`,
								}),
							);
							continue;
						}

						// Hide opening bracket.
						builder.add(
							from,
							from + 1,
							Decoration.replace({
								widget: new HiddenBracketWidget("{"),
							}),
						);

						// Type-specific rendering logic.
						if (tagInfo.type === "status") {
							const endHyphenIndex = content.lastIndexOf("-");
							const nameFrom = contentFrom;
							const nameTo = contentFrom + endHyphenIndex;
							const valueTo = contentTo;

							builder.add(
								nameFrom,
								valueTo,
								Decoration.mark({
									attributes: {
										class: `brumes-tag ${tagInfo.className}`,
										"data-status-name": tagInfo.name!,
										"data-status-value": tagInfo.value!,
									},
								}),
							);

							if (tagInfo.value === "") {
								builder.add(
									nameTo,
									nameTo + 1,
									Decoration.replace({
										widget: new HiddenBracketWidget("-"),
									}),
								);
							}
						} else if (tagInfo.type === "limit") {
							const colonIndex = content.lastIndexOf(":");
							const nameTo = contentFrom + colonIndex;
							const valueTo = contentTo;

							builder.add(
								contentFrom,
								valueTo,
								Decoration.mark({
									attributes: {
										class: `brumes-tag ${tagInfo.className}`,
										"data-limit-name": tagInfo.name!,
										"data-limit-value": tagInfo.value!,
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
							const bangIndex = content.indexOf("!");
							const nameStart = contentFrom + bangIndex + 1;

							builder.add(
								contentFrom + bangIndex,
								contentFrom + bangIndex + 1,
								Decoration.replace({
									widget: new HiddenBracketWidget("!"),
								}),
							);

							builder.add(
								nameStart,
								contentTo,
								Decoration.mark({
									attributes: {
										class: `brumes-tag ${tagInfo.className}`,
										"data-name": tagInfo.name!,
									},
								}),
							);
						} else {
							builder.add(
								contentFrom,
								contentTo,
								Decoration.mark({
									attributes: {
										class: `brumes-tag ${tagInfo.className}`,
										"data-name": tagInfo.name!,
									},
								}),
							);
						}

						// Hide closing bracket.
						builder.add(
							contentTo,
							to,
							Decoration.replace({
								widget: new HiddenBracketWidget("}"),
							}),
						);
					}
				}

				return builder.finish();
			}

			private touchesSelection(
				selection: EditorSelection,
				from: number,
				to: number,
			): boolean {
				return selection.ranges.some(
					(range) => range.from <= to && range.to >= from,
				);
			}
		},
		{
			decorations: (v) => v.decorations,
		},
	);
}
