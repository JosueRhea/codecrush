import { keyCodeToChar } from "./characters";
import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";
import { Line } from "./line";
import { insertInto, sumArrayUntilIndex } from "./utils/array";

export class Editor {
  constructor() {
    this.editorContent = null;
    this.editorEl = null;
    this.textarea = null;
    this.isFocus = false;
    this.input = null;
    this.lines = [];
    this.currentLine = 0;
    this.preEl = null;
    this.cursor = null;
    this.currentPositionOnLine = 0;
    this.lineCount = 0;
    this.lineNumbersEl = null;
    this.components = []
  }

  #setupEditor() {
    //Parent element
    const editor = document.createElement("div");
    editor.setAttribute("class", "text-editor");
    editor.setAttribute("tabindex", "0");

    // Pre element
    const pre = document.createElement("pre");
    pre.style.position = "relative";
    pre.setAttribute("class", "text-editor-content");
    editor.appendChild(pre);

    //Lines
    const lineNumbers = document.createElement("div");
    lineNumbers.classList.add("line-numbers");
    pre.appendChild(lineNumbers);
    this.lineNumbersEl = lineNumbers;

    //Code
    const code = document.createElement("code");
    code.setAttribute("class", "text-editor-code");
    pre.appendChild(code);

    document.body.appendChild(editor);

    this.editorContent = code;
    this.editorEl = editor;
    this.preEl = pre;
    const firstLine = new Line(code, "", this.lineCount, 0);
    firstLine.setLineNumber(lineNumbers, 0);
    firstLine.setIsActive(true);
    const linePos = firstLine.getPosition();
    const lineHeight = firstLine.getHeight();
    this.lines.push(firstLine);

    //cursor
    const cursor = new Cursor(pre, linePos, lineHeight);
    this.cursor = cursor;

    this.editorEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
  }

  init() {
    this.#setupEditor();
    const hiddenInput = new EditableInput();
    this.editorEl.addEventListener("click", () => {
      if (!this.isFocus) {
        hiddenInput.focus();
        this.isFocus = true;
        this.editorEl.classList.add("focused");
      }
    });

    hiddenInput.onChange((e) => {
      this.#displayText(e);
    });

    hiddenInput.onBlur((e) => {
      this.isFocus = false;
      this.editorEl.classList.remove("focused");
    });
  }

  #createNewLine(currentLineIndex, position) {
    //Deactivate the currrent line
    const currentLineEl = this.lines[currentLineIndex];
    this.lineCount += 1;
    currentLineEl.setIsActive(false);
    const contentAfterPosition = currentLineEl.getContentAfter(position);

    if (!contentAfterPosition) {
      this.currentLine += 1;
      const newLine = new Line(
        this.editorContent,
        "",
        this.currentLine,
        this.currentLine
      );
      this.lines = insertInto(this.lines, this.currentLine, newLine);
      newLine.setIsActive(true);
      this.#recomputeLineNumbers()
      newLine.setLineNumber(this.lineNumbersEl, this.currentLine);
      //Push line
      this.preEl.scrollTo({
        top: this.preEl.scrollHeight,
      });
      this.currentPositionOnLine = 0;
      this.#updateCursorPositionTo(this.currentPositionOnLine, newLine);
    } else {      
      this.currentLine += 1;
      currentLineEl.deleteCharacterAfter(position);      
      const newLine = new Line(
        this.editorContent,
        contentAfterPosition,
        this.currentLine,
        this.currentLine
      );
      this.lines = insertInto(this.lines, this.currentLine, newLine);      
      newLine.setIsActive(true);
      this.#recomputeLineNumbers()
      newLine.setLineNumber(this.lineNumbersEl, this.currentLine);
      this.preEl.scrollTo({
        top: this.preEl.scrollHeight,
      });
      this.currentPositionOnLine = 0;
      this.#updateCursorPositionTo(this.currentPositionOnLine, newLine);
    }
    // this.#recomputeLineNumbers()
  }


  #recomputeLineNumbers() {
    this.lines.forEach((line, i) => {
      line.changeLineNumber(i);
    });
  }

  #deleteLine(currentLineIndex, position) {
    const currentLine = this.lines[currentLineIndex];
    currentLine.setIsActive(false);
    currentLine.destroy();
    this.lines = this.lines.reduce((acc, curr, i) => {
      if (i !== currentLineIndex) {
        acc.push(curr);
      }
      return acc;
    }, []);
    this.#recomputeLineNumbers(currentLineIndex);
    this.lineCount -= 1;
    this.currentLine -= 1;
    const newCurrentLine = this.lines[this.currentLine];
    newCurrentLine.setIsActive(true);
    const length = position ? position : newCurrentLine.getLength();
    this.currentPositionOnLine = length;
    this.#updateCursorPositionTo(this.currentPositionOnLine, newCurrentLine);
  }

  #deleteCharacter() {
    const currentLine = this.lines[this.currentLine];
    if (currentLine.isEmpty()) {
      if (this.currentLine > 0) {
        this.#deleteLine(this.currentLine);
      }
    } else {
      if (this.currentPositionOnLine > 0) {
        currentLine.deleteCharacter(this.currentPositionOnLine);
        this.#moveLeft();
      } else {
        if (this.currentLine > 0) {
          const lineToAppend = this.lines[this.currentLine - 1];
          const newPosition = lineToAppend.getLength();
          currentLine.giveContentTo(lineToAppend);
          this.#deleteLine(this.currentLine, newPosition);
        }
      }
    }
  }

  #updateCursorPositionTo(position, line) {
    const left = line.getOffsetSum(position);
    const linePos = line.getPosition();
    this.cursor.updatePosition({
      top: linePos.top,
      left: linePos.left + left,
    });
  }

  #updateCursorPosition(currentLine) {
    const textWidth = currentLine.getTextWidth();
    const linePos = currentLine.getPosition();
    this.cursor.updatePosition({
      top: linePos.top,
      left: linePos.left + textWidth,
    });
  }

  #addCharacter(value) {
    const parsedValue = keyCodeToChar[value] ?? value;
    if (parsedValue != "") {
      const currLine = this.lines[this.currentLine];
      currLine.appendText(parsedValue, this.currentPositionOnLine);
      this.#moveRight();
      this.preEl.scrollTo({
        left: this.preEl.scrollWidth,
      });
    }
  }

  #moveLeft() {
    if (this.currentPositionOnLine > 0) {
      this.currentPositionOnLine -= 1;
      const moveOffset =
        this.lines[this.currentLine].leftMovesOffsets[
          this.currentPositionOnLine
        ];
      this.cursor.moveLeftOneCharacter(moveOffset);
    } else {
      if (this.currentLine > 0) {
        this.#moveUp(true);
      }
    }
  }

  #moveRight() {
    const currentLine = this.lines[this.currentLine];
    if (this.currentPositionOnLine < currentLine.getLength()) {
      this.currentPositionOnLine += 1;
      const moveOffset =
        currentLine.leftMovesOffsets[this.currentPositionOnLine - 1];
      this.cursor.moveRightOneCharacter(moveOffset);
    } else {
      if (this.currentLine < this.lines.length) {
        this.#moveDown(true);
      }
    }
  }

  #moveUp(endOfLine = false) {
    if (this.currentLine > 0 && !endOfLine) {
      this.lines[this.currentLine].setIsActive(false);
      this.currentLine -= 1;
      const newCurrentLine = this.lines[this.currentLine];
      newCurrentLine.setIsActive(true);
      const leftOffset = sumArrayUntilIndex(
        newCurrentLine.leftMovesOffsets,
        this.currentPositionOnLine
      );
      if (newCurrentLine.leftMovesOffsets.length < this.currentPositionOnLine) {
        this.currentPositionOnLine = newCurrentLine.leftMovesOffsets.length;
        this.#updateCursorPosition(newCurrentLine);
      } else {
        const { top } = newCurrentLine.getPosition();
        this.cursor.updatePosition({ top, leftOffset });
      }
    }

    if (this.currentLine > 0 && endOfLine) {
      this.lines[this.currentLine].setIsActive(false);
      this.currentLine -= 1;
      const newCurrentLine = this.lines[this.currentLine];
      newCurrentLine.setIsActive(true);
      this.currentPositionOnLine = newCurrentLine.leftMovesOffsets.length;
      this.#updateCursorPosition(newCurrentLine);
    }
  }

  #moveDown(startOfLine = false) {
    if (this.currentLine < this.lines.length - 1 && !startOfLine) {
      this.lines[this.currentLine].setIsActive(false);
      this.currentLine += 1;
      const newCurrentLine = this.lines[this.currentLine];
      newCurrentLine.setIsActive(true);
      const leftOffset = sumArrayUntilIndex(
        newCurrentLine.leftMovesOffsets,
        this.currentPositionOnLine
      );
      if (newCurrentLine.leftMovesOffsets.length < this.currentPositionOnLine) {
        this.currentPositionOnLine = newCurrentLine.leftMovesOffsets.length;
        this.#updateCursorPosition(newCurrentLine);
      } else {
        const { top } = newCurrentLine.getPosition();
        this.cursor.updatePosition({ top, leftOffset });
      }
    }

    if (this.currentLine < this.lines.length - 1 && startOfLine) {
      this.lines[this.currentLine].setIsActive(false);
      this.currentLine += 1;
      const newCurrentLine = this.lines[this.currentLine];
      newCurrentLine.setIsActive(true);
      const pos = newCurrentLine.getPosition();
      this.currentPositionOnLine = 0;
      this.cursor.updatePosition({ top: pos.top, left: pos.left });
    }
  }

  #displayText(value) {
    switch (value) {
      case "Backspace":
        this.#deleteCharacter();
        break;
      case "Enter":
        this.#createNewLine(this.currentLine, this.currentPositionOnLine);
        break;
      case "ArrowLeft":
        this.#moveLeft();
        break;
      case "ArrowRight":
        this.#moveRight();
        break;
      case "ArrowUp":
        this.#moveUp();
        break;
      case "ArrowDown":
        this.#moveDown();
        break;
      default:
        this.#addCharacter(value);
        break;
    }
    // console.log({
    //   posOnLine: this.currentPositionOnLine,
    //   currLineIndex: this.currentLine,
    //   offsets: this.lines[this.currentLine].leftMovesOffsets,
    // });
  }

  use(component){
    this.components.push(component)
  }
}
