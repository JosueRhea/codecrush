import { keyCodeToChar } from "./characters";
import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";
import { Line } from "./line";

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

  #displayText(value) {
    if (value == "Backspace") {
      const currentLine = this.lines[this.currentLine];
      if (currentLine.isEmpty()) {
        if (this.currentLine > 0) {
          currentLine.setIsActive(false);
          currentLine.destroy();
          this.lines.pop();
          this.currentLine -= 1;
          this.lines[this.currentLine].setIsActive(true);
        }
      } else {
        currentLine.deleteCharacter();
      }
    } else if (value == "Enter") {
      this.lines[this.currentLine].setIsActive(false);
      const newLine = new Line(this.editorContent, "");
      newLine.setIsActive(true);
      this.lines.push(newLine);
      this.currentLine += 1;
      this.preEl.scrollTo({
        top: this.preEl.scrollHeight,
      });
    } else {
      const parsedValue = keyCodeToChar[value] ?? value;
      const currLine = this.lines[this.currentLine];
      currLine.appendText(parsedValue);
      const textWidth = currLine.getTextWidth();
      const linePos = currLine.getPosition();
      this.cursor.updatePosition({
        top: linePos.top,
        left: linePos.left + textWidth,
      });
    }
  }
}
