import { keyCodeToChar } from "./characters";
import { Component } from "./Component";
import { sumArrayUntilIndex } from "./utils/array";

export class Navigation extends Component {
  constructor() {
    super();
  }

  onKeyPressed(key) {
    switch (key) {
      case "ArrowLeft":
        this.moveLeft();
        break;
      case "ArrowUp":
        this.moveUp();
        break;
      case "ArrowDown":
        this.moveDown();
        break;
      case "ArrowRight":
        this.moveRight();
        break;
      case "Enter":
        break;
      case "Backspace":
        break;
      default:
        const parsedValue = keyCodeToChar[key] ?? key;
        if (parsedValue == "") return;
        this.moveRight();
        this.editor.preEl.scrollTo({
          left: this.editor.preEl.scrollWidth,
        });
        break;
    }
  }

  onCharacterDelete() {
    if (this.editor.currentPositionOnLine > 0) {
      this.editor.currentPositionOnLine -= 1;
      const moveOffset =
        this.editor.lines[this.editor.currentLineIndex].leftMovesOffsets[
          this.editor.currentPositionOnLine
        ];
      this.editor.cursor.moveLeftOneCharacter(moveOffset);
    } else {
      if (this.editor.currentLineIndex > 0) {
        this.moveUp();
      }
    }
  }

  onNewLine() {
    this.editor.currentLineIndex += 1;
    const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
    this.editor.currentPositionOnLine = 0;
    this.updateCursorPositionTo(
      this.editor.currentPositionOnLine,
      newCurrentLine
    );
  }

  onDeleteLine(positionOnLine) {
    this.editor.currentLineIndex -= 1;
    this.editor.currentPositionOnLine = positionOnLine;
    this.updateCursorPositionTo(
      this.editor.currentPositionOnLine,
      this.editor.lines[this.editor.currentLineIndex]
    );
  }

  moveRight() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.currentPositionOnLine < currentLine.getLength()) {
      this.editor.currentPositionOnLine += 1;
      const moveOffset =
        currentLine.leftMovesOffsets[this.editor.currentPositionOnLine - 1];
      this.editor.cursor.moveRightOneCharacter(moveOffset);
    } else {
      if (this.editor.currentLineIndex < this.editor.lines.length) {
        this.moveDown(true);
      }
    }
  }

  moveLeft() {
    if (this.editor.currentPositionOnLine > 0) {
      this.editor.currentPositionOnLine -= 1;
      const moveOffset =
        this.editor.lines[this.editor.currentLineIndex].leftMovesOffsets[
          this.editor.currentPositionOnLine
        ];
      this.editor.cursor.moveLeftOneCharacter(moveOffset);
    } else {
      if (this.editor.currentLineIndex > 0) {
        this.moveUp(true);
      }
    }
  }

  moveUp(endOfLine = false) {
    if (this.editor.currentLineIndex > 0 && !endOfLine) {
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      this.editor.currentLineIndex -= 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      if (
        newCurrentLine.leftMovesOffsets.length <
        this.editor.currentPositionOnLine
      ) {
        this.editor.currentPositionOnLine =
          newCurrentLine.leftMovesOffsets.length;
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
      } else {
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
      }
    }

    if (this.editor.currentLineIndex > 0 && endOfLine) {
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      this.editor.currentLineIndex -= 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      this.editor.currentPositionOnLine =
        newCurrentLine.leftMovesOffsets.length;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        newCurrentLine
      );
    }
  }

  moveDown(startOfLine = false) {
    if (
      this.editor.currentLineIndex < this.editor.lines.length - 1 &&
      !startOfLine
    ) {
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      this.editor.currentLineIndex += 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      if (
        newCurrentLine.leftMovesOffsets.length <
        this.editor.currentPositionOnLine
      ) {
        this.editor.currentPositionOnLine =
          newCurrentLine.leftMovesOffsets.length;
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
      } else {
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
      }
    }

    if (
      this.editor.currentLineIndex < this.editor.lines.length - 1 &&
      startOfLine
    ) {
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      this.editor.currentLineIndex += 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      this.editor.currentPositionOnLine = 0;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        newCurrentLine
      );
    }
  }

  updateCursorPositionTo(position, line) {
    const left = line.getOffsetSum(position);
    const linePos = line.getPosition();
    this.editor.cursor.updatePosition({
      top: linePos.top,
      left: linePos.left + left,
    });
  }
}
