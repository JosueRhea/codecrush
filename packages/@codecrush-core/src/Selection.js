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
          this.selectText();
        } else {
          this.deselectText();
        }
        break;
      default:
        break;
    }
  }

  selectText() {
    if (this.editor.isSelecting) {
      // const range = document.createRange();
      // this.range =
      // range.setStart(p1.firstChild, 0);
      // range.setEnd(p2.firstChild, 4);
      // const selection = window.getSelection();
      // selection.removeAllRanges();
      // selection.addRange(range);
    } else {
      this.editor.isSelecting = true;
    //   const textEl = this.editor.lines[this.editor.currentLineIndex].textEl;
    //   this.range = document.createRange();
    //   console.log(textEl)
    //   this.range.setStart(
    //     textEl,
    //     this.editor.currentPositionOnLine
    //   );
    //   range.setEnd(textEl, this.editor.currentPositionOnLine - 1);
    //   const selection = window.getSelection();
    //   selection.removeAllRanges();
    //   selection.addRange(range);
    }
  }

  deselectText() {
    if (this.editor.isSelecting) this.editor.isSelecting = false;
  }
}
