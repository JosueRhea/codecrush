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
  }

  #setupEditor() {
    //Parent element
    const editor = document.createElement("div");
    editor.setAttribute("class", "text-editor");
    editor.setAttribute("tabindex", "0");

    // Pre element
    const pre = document.createElement("pre");
    pre.setAttribute("class", "text-editor-content");
    editor.appendChild(pre);

    //Code
    const code = document.createElement("code");
    code.setAttribute("class", "text-editor-code");
    pre.appendChild(code);

    //cursor
    const cursor = new Cursor(editor, 0);

    document.body.appendChild(editor);

    this.editorContent = code;
    this.editorEl = editor;
    this.lines.push(new Line(code, ""));
  }

  init() {
    this.#setupEditor();
    const hiddenInput = new EditableInput();
    this.editorEl.addEventListener("click", () => {
      hiddenInput.focus();
      this.isFocus = true;
      this.editorEl.classList.add("focused");
    });

    hiddenInput.onChange((e) => {
      this.#displayText(e);
    });

    hiddenInput.onBlur(() => {
      this.isFocus = false;
      this.editorEl.classList.remove("focused");
    });
  }

  #displayText(value) {
    console.log(this.lines);
    if (value == "Backspace") {
      const currentLine = this.lines[this.currentLine];
      if (currentLine.isEmpty()) {
        if (this.currentLine > 0) {
          currentLine.destroy();
          this.lines.pop();
          this.currentLine -= 1;
        }
      } else {
        currentLine.deleteCharacter();
      }
    } else if (value == "Enter") {
      this.lines.push(new Line(this.editorContent, ""));
      this.currentLine += 1;
    } else {
      const parsedValue = keyCodeToChar[value] ?? value;
      // this.editorContent.textContent += parsedValue;
      this.lines[this.currentLine].appendText(parsedValue);
    }
  }
}
