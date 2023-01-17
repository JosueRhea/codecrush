import { Completion } from "./completion";
import { Component } from "./Component";
import { findQuery } from "./langs/typescript";

export class AutoCompletion extends Component {
  constructor() {
    super();
    this.results = [];
    this.completionEl = null;
  }

  onKeyPressed(e) {
    const result = findQuery(e);
    this.results = result;
    this.renderAutoCompletion();
  }

  renderAutoCompletion() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const linePos = currentLine.getPosition();
    const currentLineHeight = currentLine.getClientHeight();
    const autoCompletionTop = linePos.top + currentLineHeight;
    const autoCompletionLeft = linePos.left;
    const editorWidth = this.editor.editorEl.getBoundingClientRect().width;

    // Create the autocompletion if not exist
    if (!this.completionEl) {
      const completionEl = new Completion(
        this.editor.preEl,
        editorWidth / 2,
        autoCompletionTop,
        autoCompletionLeft
      );
      this.completionEl = completionEl;
    }
  }
}
