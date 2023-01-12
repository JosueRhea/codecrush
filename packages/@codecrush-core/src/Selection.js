import { Component } from "./Component";

export class Selection extends Component {
  constructor() {
    super();
    this.range = null;
  }

  onPositionChange(data) {
    console.log(data);
  }

  selectTextToLeft() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.isSelecting) {
    } else {
      const selection = {
        lineIndex: this.editor.currentLineIndex,
        start: this.editor.currentPositionOnLine - 1,
        end: this.editor.currentPositionOnLine,
      };
      console.log(selection);
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
    // console.log("Calling deselect");
    if (this.editor.isSelecting) {
      this.editor.isSelecting = false;
      //   this.editor.lines.forEach((line) => {
      //     if (line.selection) {
      //       line.selection = null;
      //       line.selectionEl.style.top = "";
      //       line.selectionEl.style.left = "";
      //       line.selectionEl.style.width = "";
      //       line.selectionEl.style.height = "";
      //     }
      //   });
    }
  }

  renderSelection(line) {
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
