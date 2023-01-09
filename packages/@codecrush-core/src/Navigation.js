import { Component } from "./Component";

export class Navigation extends Component {
  constructor() {
    super();
  }

  onKeyPressed(key) {
    this.moveRight()
    // this.preEl.scrollTo({
    //   left: this.preEl.scrollWidth,
    // });
  }

  moveRight() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.currentPositionOnLine < currentLine.getLength()) {
      this.editor.currentPositionOnLine += 1;
      const moveOffset =
        currentLine.leftMovesOffsets[this.editor.currentPositionOnLine - 1];
      this.editor.cursor.moveRightOneCharacter(moveOffset);
    } else {
      // if (this.currentLine < this.lines.length) {
      //   this.#moveDown(true);
      // }
    }
  }
}
