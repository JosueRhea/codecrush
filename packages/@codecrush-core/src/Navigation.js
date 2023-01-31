import { keyCodeToChar } from "./characters";
import { Component } from "./Component";
import { inRange } from "./utils/numbers";

export class Navigation extends Component {
  constructor() {
    super("navigation");
  }

  onKeyPressed(key, withCtrlKey) {
    switch (key) {
      case "ArrowLeft":
        if (withCtrlKey) return this.moveLeftOneWord();
        this.moveLeft();
        break;
      case "ArrowUp":
        if (this.editor.isAutoCompleting) break;
        this.moveUp();
        break;
      case "ArrowDown":
        if (this.editor.isAutoCompleting) break;
        this.moveDown();
        break;
      case "ArrowRight":
        if (withCtrlKey) {
          this.moveRightOneWord();
          break;
        }
        this.moveRight();
        break;
      case "PageDown":
        if (this.editor.isAutoCompleting) break;
        this.movePageDown();
        break;
      case "PageUp":
        if (this.editor.isAutoCompleting) break;
        this.movePageUp();
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
        // const parsedValue = keyCodeToChar[key] ?? key;
        // if (parsedValue == "") return;
        // this.moveRight();
        break;
    }

    this.updateScroll();
  }

  onCharacterDelete() {
    if (this.editor.currentPositionOnLine > 0) {
      this.editor.currentPositionOnLine -= 1;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        this.editor.lines[this.editor.currentLineIndex]
      );
      this.editor.onPositionChange({
        before: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine + 1,
          },
        },
        after: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine,
          },
        },
      });
    } else {
      if (this.editor.currentLineIndex > 0) {
        this.moveUp();
      }
    }
  }

  onNewLine() {
    this.editor.currentLineIndex += 1;
    const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
    const beforeCursorPosition = this.editor.currentPositionOnLine;
    this.editor.currentPositionOnLine = 0;
    this.updateCursorPositionTo(
      this.editor.currentPositionOnLine,
      newCurrentLine
    );
    this.editor.onPositionChange({
      before: {
        line: {
          index: this.editor.currentLineIndex - 1,
          position: beforeCursorPosition,
        },
      },
      after: {
        line: {
          index: this.editor.currentLineIndex,
          position: this.editor.currentPositionOnLine,
        },
      },
    });
  }

  onDeleteLine(positionOnLine) {
    this.editor.currentLineIndex -= 1;
    const beforeCursorPosition = this.editor.currentPositionOnLine;
    this.editor.currentPositionOnLine = positionOnLine;
    this.updateCursorPositionTo(
      this.editor.currentPositionOnLine,
      this.editor.lines[this.editor.currentLineIndex]
    );
    this.editor.onPositionChange({
      before: {
        line: {
          index: this.editor.currentLineIndex + 1,
          position: beforeCursorPosition,
        },
      },
      after: {
        line: {
          index: this.editor.currentLineIndex,
          position: this.editor.currentPositionOnLine,
        },
      },
    });
  }

  moveRight() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.currentPositionOnLine < currentLine.getLength()) {
      const beforeCursorPosition = this.editor.currentPositionOnLine;
      this.editor.currentPositionOnLine += 1;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        this.editor.lines[this.editor.currentLineIndex]
      );
      this.editor.onPositionChange({
        before: {
          line: {
            index: this.editor.currentLineIndex,
            position: beforeCursorPosition,
          },
        },
        after: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine,
          },
        },
      });
    } else {
      if (this.editor.currentLineIndex < this.editor.lines.length) {
        this.moveDown(true);
      }
    }
  }

  moveLeftOneWord() {
    if (this.editor.currentPositionOnLine > 0) {
      const currentLine = this.editor.lines[this.editor.currentLineIndex];
      const newPosition =
        currentLine.getBeforeWordPosition(this.editor.currentPositionOnLine) ??
        0;
      const beforeCursorPosition = this.editor.currentPositionOnLine;
      this.editor.currentPositionOnLine = newPosition;
      this.updateCursorPositionTo(newPosition, currentLine);
      this.editor.onPositionChange({
        before: {
          line: {
            index: this.editor.currentLineIndex,
            position: beforeCursorPosition,
          },
        },
        after: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine,
          },
        },
      });
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
      const beforeCursorPosition = this.editor.currentPositionOnLine;
      this.editor.currentPositionOnLine = newPosition;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        currentLine
      );
      this.editor.onPositionChange({
        before: {
          line: {
            index: this.editor.currentLineIndex,
            position: beforeCursorPosition,
          },
        },
        after: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine,
          },
        },
      });
    } else {
      if (this.editor.currentLineIndex < this.editor.lines.length) {
        this.moveDown(true);
      }
    }
  }

  moveLeft() {
    if (this.editor.currentPositionOnLine > 0) {
      const beforeCursorPosition = this.editor.currentPositionOnLine;
      this.editor.currentPositionOnLine -= 1;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        this.editor.lines[this.editor.currentLineIndex]
      );
      this.editor.onPositionChange({
        before: {
          line: {
            index: this.editor.currentLineIndex,
            position: beforeCursorPosition,
          },
        },
        after: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine,
          },
        },
      });
    } else {
      if (this.editor.currentLineIndex > 0) {
        this.moveUp(true);
      }
    }
  }

  moveUp(endOfLine = false) {
    if (this.editor.currentLineIndex > 0 && !endOfLine) {
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      const beforeCurrentLineIndex = this.editor.currentLineIndex;
      this.editor.currentLineIndex -= 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      if (
        newCurrentLine.leftMovesOffsets.length <
        this.editor.currentPositionOnLine
      ) {
        const beforeCursorPosition = this.editor.currentPositionOnLine;
        this.editor.currentPositionOnLine =
          newCurrentLine.leftMovesOffsets.length;
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
        this.editor.onPositionChange({
          before: {
            line: {
              index: beforeCurrentLineIndex,
              position: beforeCursorPosition,
            },
          },
          after: {
            line: {
              index: this.editor.currentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
        });
      } else {
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
        this.editor.onPositionChange({
          before: {
            line: {
              index: beforeCurrentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
          after: {
            line: {
              index: this.editor.currentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
        });
      }
    }

    if (this.editor.currentLineIndex > 0 && endOfLine) {
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      const beforeCurrentLineIndex = this.editor.currentLineIndex;
      this.editor.currentLineIndex -= 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      const beforeCursorPosition = this.editor.currentPositionOnLine;
      this.editor.currentPositionOnLine = newCurrentLine.getLength();
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        newCurrentLine
      );
      this.editor.onPositionChange({
        before: {
          line: {
            index: beforeCurrentLineIndex,
            position: beforeCursorPosition,
          },
        },
        after: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine,
          },
        },
      });
    }
  }

  moveDown(startOfLine = false) {
    if (
      this.editor.currentLineIndex < this.editor.lines.length - 1 &&
      !startOfLine
    ) {
      //Deactive current line
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      const beforeCurrentLineIndex = this.editor.currentLineIndex;
      this.editor.currentLineIndex += 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      if (
        newCurrentLine.leftMovesOffsets.length <
        this.editor.currentPositionOnLine
      ) {
        const beforeCursorPosition = this.editor.currentPositionOnLine;
        this.editor.currentPositionOnLine =
          newCurrentLine.leftMovesOffsets.length;
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
        this.editor.onPositionChange({
          before: {
            line: {
              index: beforeCurrentLineIndex,
              position: beforeCursorPosition,
            },
          },
          after: {
            line: {
              index: this.editor.currentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
        });
      } else {
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
        this.editor.onPositionChange({
          before: {
            line: {
              index: beforeCurrentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
          after: {
            line: {
              index: this.editor.currentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
        });
      }
    }

    if (
      this.editor.currentLineIndex < this.editor.lines.length - 1 &&
      startOfLine
    ) {
      this.editor.lines[this.editor.currentLineIndex].setIsActive(false);
      const beforeCurrentLineIndex = this.editor.currentLineIndex;
      this.editor.currentLineIndex += 1;
      const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
      newCurrentLine.setIsActive(true);
      const beforeCursorPosition = this.editor.currentPositionOnLine;
      this.editor.currentPositionOnLine = 0;
      this.updateCursorPositionTo(
        this.editor.currentPositionOnLine,
        newCurrentLine
      );
      this.editor.onPositionChange({
        before: {
          line: {
            index: beforeCurrentLineIndex,
            position: beforeCursorPosition,
          },
        },
        after: {
          line: {
            index: this.editor.currentLineIndex,
            position: this.editor.currentPositionOnLine,
          },
        },
      });
    }
  }

  movePageDown() {
    for (let i = 0; i < this.editor.linesInViewport; i++) {
      this.moveDown();
    }
  }

  movePageUp() {
    for (let i = 0; i < this.editor.linesInViewport; i++) {
      this.moveUp();
    }
  }

  moveEndOfLine() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const position = currentLine.getLength();
    const beforeCursorPosition = this.editor.currentPositionOnLine;
    this.editor.currentPositionOnLine = position;
    this.updateCursorPositionTo(this.editor.currentPositionOnLine, currentLine);
    this.editor.onPositionChange({
      before: {
        line: {
          index: this.editor.currentLineIndex,
          position: beforeCursorPosition,
        },
      },
      after: {
        line: {
          index: this.editor.currentLineIndex,
          position: this.editor.currentPositionOnLine,
        },
      },
    });
  }

  moveStartOfLine() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const beforeCursorPosition = this.editor.currentPositionOnLine;
    this.editor.currentPositionOnLine = 0;
    this.updateCursorPositionTo(this.editor.currentPositionOnLine, currentLine);
    this.editor.onPositionChange({
      before: {
        line: {
          index: this.editor.currentLineIndex,
          position: beforeCursorPosition,
        },
      },
      after: {
        line: {
          index: this.editor.currentLineIndex,
          position: this.editor.currentPositionOnLine,
        },
      },
    });
  }

  updateCursorPositionTo(position, line) {
    const left = line.getOffsetSum(position);
    const linePos = line.getPosition();
    this.editor.cursor.updatePosition({
      top: linePos.top,
      left: linePos.left + left,
    });
  }

  updatePositionOnLine(position, lineIndex) {
    this.editor.currentPositionOnLine = position
    //Deactive current line
    this.editor.lines[this.editor.currentLineIndex].setIsActive(false);

    //New current line
    this.editor.currentLineIndex = lineIndex
    this.editor.lines[lineIndex].setIsActive(true)

    //get here
    const line = this.editor.lines[lineIndex]
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

    if (relativePos.y > containerPos.height - lineHeight - 25) {
      const scrollY = relativePos.y - containerPos.height + lineHeight;
      this.editor.preEl.scrollTop = this.editor.preEl.scrollTop + scrollY + 25;
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

  //Mouse navigation
  onMouseClick(clickX, clickY) {
    const y = clickY;
    const currentLineIndex = this.editor.currentLineIndex;

    const lineIndex = this.editor.lines.findIndex((n) => {
      const linePos = n.getPosition();
      return inRange(y, linePos.top, linePos.top + n.getClientHeight());
    });

    if (lineIndex !== -1) {
      const movements = lineIndex - currentLineIndex;
      if (movements > 0) {
        for (let i = 0; i < movements; i++) {
          this.moveDown();
        }
        const beforeCursorPosition = this.editor.currentPositionOnLine;
        const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
        const newCurrentLinePos = newCurrentLine.getPosition();
        const newPosition = newCurrentLine.getClosestPositionIndex(
          clickX - newCurrentLinePos.left
        );
        this.editor.currentPositionOnLine = newPosition;
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
        this.editor.onPositionChange({
          before: {
            line: {
              index: this.editor.currentLineIndex,
              position: beforeCursorPosition,
            },
          },
          after: {
            line: {
              index: this.editor.currentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
        });
      } else {
        for (let i = 0; i < Math.abs(movements); i++) {
          this.moveUp();
        }

        const beforeCursorPosition = this.editor.currentPositionOnLine;
        const newCurrentLine = this.editor.lines[this.editor.currentLineIndex];
        const newCurrentLinePos = newCurrentLine.getPosition();
        const newPosition = newCurrentLine.getClosestPositionIndex(
          clickX - newCurrentLinePos.left
        );
        this.editor.currentPositionOnLine = newPosition;
        this.updateCursorPositionTo(
          this.editor.currentPositionOnLine,
          newCurrentLine
        );
        this.editor.onPositionChange({
          before: {
            line: {
              index: this.editor.currentLineIndex,
              position: beforeCursorPosition,
            },
          },
          after: {
            line: {
              index: this.editor.currentLineIndex,
              position: this.editor.currentPositionOnLine,
            },
          },
        });
      }
    } else {
      const linesBottom = this.editor.lines.length - currentLineIndex;
      for (let i = 0; i < linesBottom; i++) {
        this.moveDown();
        this.moveEndOfLine();
      }
    }
    if (!this.editor.isMouseSelecting) {
      const selection = this.editor.getComponent("selection");
      selection.deselectText();
    }
  }
}
