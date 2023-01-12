import { Component } from "./Component";

export class Selection extends Component {
  constructor() {
    super();
    this.range = null;
    this.isShiftKey = false;
  }

  onKeyPressed(key, _, shiftKey) {
    if (shiftKey) this.isShiftKey = true;
    else {
      this.isShiftKey = false;
      this.deselectText();
    }
  }

  onPositionChange(data) {
    if (!this.isShiftKey) return;
    const isLeft = data.before.line.position > data.after.line.position;
    if (isLeft) {
      const lineIndex = data.before.line.index;
      this.selectTextToLeft(
        lineIndex,
        data.after.line.position,
        data.before.line.position
      );
    }
  }

  selectTextToLeft(lineIndex, start, end) {
    const currentLine = this.editor.lines[lineIndex];
    if (this.editor.isSelecting) {
      this.editor.editorSelection.map((selection) => {
        if (selection.lineIndex === lineIndex) {
          selection.start = start;
          const width = currentLine.getOffsetSumRange(
            selection.start,
            selection.end
          );
          const left = currentLine.getOffsetSum(selection.start);
          selection.width = width;
          selection.left = left;
          this.editor.editorSelection.push(selection);
          this.renderSelection();
        }
      });
    } else {
      this.editor.isSelecting = true;
      const selection = {
        lineIndex: this.editor.currentLineIndex,
        start: start,
        end: end,
      };
      const width = currentLine.getOffsetSumRange(
        selection.start,
        selection.end
      );
      const left = currentLine.getOffsetSum(selection.start);
      selection.width = width;
      selection.left = left;
      this.editor.editorSelection.push(selection);
      this.renderSelection();
    }
  }

  deselectText() {
    if (this.editor.isSelecting) {
      this.editor.isSelecting = false;
      this.editor.editorSelection.forEach(({ lineIndex }) => {
        const line = this.editor.lines[lineIndex];
        line.selection = null;
        line.selectionEl.style.top = "";
        line.selectionEl.style.left = "";
        line.selectionEl.style.width = "";
        line.selectionEl.style.height = "";
      });
      this.editor.editorSelection.length = 0;
    }
  }

  renderSelection() {
    this.editor.editorSelection.forEach(({ lineIndex, width, left }) => {
      const line = this.editor.lines[lineIndex];
      const linePos = line.getPosition();
      line.selectionEl.style.top = linePos.top + "px";
      line.selectionEl.style.left = linePos.left + left + "px";
      line.selectionEl.style.width = width + "px";
      line.selectionEl.style.height = line.getClientHeight() + "px";
    });
  }
}
