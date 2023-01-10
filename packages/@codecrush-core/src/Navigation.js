import { keyCodeToChar } from "./characters";
import { Component } from "./Component";

export class Navigation extends Component {
  constructor() {
    super();
  }

  onKeyPressed(key, withCtrlKey) {
    switch (key) {
      case "ArrowLeft":
        if (withCtrlKey) return this.moveLeftOneWord();
        this.moveLeft();
        break;
      case "ArrowUp":
        this.moveUp();
        break;
      case "ArrowDown":
        this.moveDown();
        break;
      case "ArrowRight":
        if (withCtrlKey) return this.moveRightOneWord();
        this.moveRight();
        break;
      case "Backspace":
        break;
      case "Enter":
        break;
      case "Home":
        this.moveStartOfLine();
        break;
      case "End":
        this.moveEndOfLine();
        break;
      default:
        const parsedValue = keyCodeToChar[key] ?? key;
        if (parsedValue == "") return;
        this.moveRight();
        break;
    }

    this.updateScroll();
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

  moveLeftOneWord() {
    if (this.editor.currentPositionOnLine > 0) {
      const currentLine = this.editor.lines[this.editor.currentLineIndex];
      if (currentLine.positions.length <= 0) return this.moveStartOfLine();
      const newPosition =
        currentLine.getBeforeWordPosition(this.editor.currentPositionOnLine) ??
        0;
      this.editor.currentPositionOnLine = newPosition;
      this.updateCursorPositionTo(newPosition, currentLine);
    } else {
      if (this.editor.currentLineIndex > 0) {
        this.moveUp(true);
      }
    }
  }

  moveRightOneWord() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.currentPositionOnLine < currentLine.getLength()) {
      const newPosition =
        currentLine.getAfterWordPosition(this.editor.currentPositionOnLine) ??
        currentLine.getLength();
      this.editor.currentPositionOnLine = newPosition;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        currentLine
      );
      // const moveOffset =
      //   currentLine.leftMovesOffsets[this.editor.currentPositionOnLine - 1];
      // this.editor.cursor.moveRightOneCharacter(moveOffset);
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

  moveEndOfLine() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const position = currentLine.getLength();
    this.editor.currentPositionOnLine = position;
    this.updateCursorPositionTo(this.editor.currentPositionOnLine, currentLine);
  }

  moveStartOfLine() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    this.editor.currentPositionOnLine = 0;
    this.updateCursorPositionTo(this.editor.currentPositionOnLine, currentLine);
  }

  updateCursorPositionTo(position, line) {
    const left = line.getOffsetSum(position);
    const linePos = line.getPosition();
    this.editor.cursor.updatePosition({
      top: linePos.top,
      left: linePos.left + left,
    });
  }

  updateScroll() {
    const cursorPos = this.editor.cursor.getPosition();
    const containerPos = this.editor.editorEl.getBoundingClientRect();
    const relativePos = {
      x: cursorPos.left - containerPos.left,
      y: cursorPos.top - containerPos.top,
    };
    const lineHeight =
      this.editor.lines[this.editor.currentLineIndex].getClientHeight();

    if (relativePos.y > containerPos.height - lineHeight - 20) {
      const scrollY = relativePos.y - containerPos.height + lineHeight;
      this.editor.preEl.scrollTop = this.editor.preEl.scrollTop + scrollY + 20;
    }

    if (relativePos.y < 0) {
      this.editor.preEl.scrollTop = this.editor.preEl.scrollTop + relativePos.y;
    }

    if (relativePos.x > containerPos.width - cursorPos.width - 20) {
      const scrollX = relativePos.x - containerPos.width + cursorPos.width;
      this.editor.preEl.scrollLeft =
        this.editor.preEl.scrollLeft + scrollX + 20;
    }

    if (relativePos.x == 0) {
      this.editor.preEl.scrollLeft = 0;
    }
    if (relativePos.x < 0) {
      this.editor.preEl.scrollLeft =
        this.editor.preEl.scrollLeft + relativePos.x;
    }
  }
}
