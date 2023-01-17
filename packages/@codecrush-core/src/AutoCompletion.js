import { keyCodeToChar } from "./characters";
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
    const parsedText = keyCodeToChar[e];
    if (!parsedText) {
      const result = findQuery(e);
      this.results = result;
      this.render();
    } else {
      this.completionEl.quit();
    }
  }

  render() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const linePos = currentLine.getPosition();
    const currentLineHeight = currentLine.getClientHeight();
    const autoCompletionTop = linePos.top + currentLineHeight + 5;
    const autoCompletionLeft = this.editor.cursor.getLeft();
    const editorWidth = this.editor.editorEl.getBoundingClientRect().width;

    // Create the autocompletion if not exist
    if (!this.completionEl) {
      const completionEl = new Completion(this.editor.preEl);
      this.completionEl = completionEl;
    }

    this.completionEl.render(
      editorWidth / 2,
      autoCompletionTop,
      autoCompletionLeft
    );
  }
}
