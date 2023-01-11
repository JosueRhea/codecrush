import { Component } from "./Component";

export class Selection extends Component {
  constructor() {
    super();
    this.range = null;
  }

  onKeyPressed(key, _, shiftKey) {
    switch (key) {
      case "ArrowLeft":
        if (shiftKey) {
          this.selectTextToLeft();
        } else {
          this.deselectText();
        }
        break;
      default:
        break;
    }
    console.log(this.editor.lines[this.editor.currentLineIndex].selection);
  }

  selectTextToLeft() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.isSelecting) {
      currentLine.selection.start = this.editor.currentPositionOnLine;
      currentLine.selection.width = currentLine.getOffsetSumRange(
        currentLine.selection.start,
        currentLine.selection.end
      );
      currentLine.selection.left = currentLine.getOffsetSum(
        this.editor.currentPositionOnLine
      );
      this.renderSelection();
    } else {
      this.editor.isSelecting = true;
      currentLine.selection = {
        start: this.editor.currentPositionOnLine,
        end: this.editor.currentPositionOnLine + 1,
      };

      currentLine.selection.width = currentLine.getOffsetSumRange(
        currentLine.selection.start,
        currentLine.selection.end
      );

      currentLine.selection.left = currentLine.getOffsetSum(
        this.editor.currentPositionOnLine
      );
      this.renderSelection();
    }
  }

  deselectText() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.isSelecting) {
      this.editor.isSelecting = false;
      currentLine.selection = null;
      currentLine.selectionEl.style.top = "";
      currentLine.selectionEl.style.left = "";
      currentLine.selectionEl.style.width = "";
      currentLine.selectionEl.style.height = "";      
    }
  }

  renderSelection() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const linePos = currentLine.getPosition();
    if (currentLine.selection) {
      currentLine.selectionEl.style.top = linePos.top + "px";
      currentLine.selectionEl.style.left =
        linePos.left + currentLine.selection.left + "px";
      currentLine.selectionEl.style.width = currentLine.selection.width + "px";
      currentLine.selectionEl.style.height =
        currentLine.getClientHeight() + "px";
    }
  }
}
