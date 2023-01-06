import { keyCodeToChar } from "./characters";
import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";
import { Line } from "./line";
import { sumArrayUntilIndex } from "./utils/array";

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

    //Code
    const code = document.createElement("code");
    code.setAttribute("class", "text-editor-code");
    pre.appendChild(code);

    document.body.appendChild(editor);

    this.editorContent = code;
    this.editorEl = editor;
    this.preEl = pre;
    const firstLine = new Line(code, "");
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

  #createNewLine() {
    this.lines[this.currentLine].setIsActive(false);
    const newLine = new Line(this.editorContent, "");
    newLine.setIsActive(true);
    this.lines.push(newLine);
    this.currentLine += 1;
    this.preEl.scrollTo({
      top: this.preEl.scrollHeight,
    });
    this.currentPositionOnLine = 0;
    this.#updateCursorPosition(this.lines[this.currentLine]);
  }
  #deleteLine(currentLine) {
    currentLine.setIsActive(false);
    currentLine.destroy();
    this.lines.pop();
    this.currentLine -= 1;
    const newCurrentLine = this.lines[this.currentLine];
    newCurrentLine.setIsActive(true);
    const length = newCurrentLine.getLength();
    this.currentPositionOnLine = length;
    this.#updateCursorPosition(this.lines[this.currentLine]);
  }

  #deleteCharacter() {
    const currentLine = this.lines[this.currentLine];
    if (currentLine.isEmpty()) {
      if (this.currentLine > 0) {
        this.#deleteLine(currentLine);
      }
    } else {
      currentLine.deleteCharacter();
      this.#updateCursorPosition(this.lines[this.currentLine]);
    }
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
      currLine.appendText(parsedValue);
      this.#updateCursorPosition(currLine);
      this.currentPositionOnLine += 1;
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
        this.#createNewLine();
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
  }
}
