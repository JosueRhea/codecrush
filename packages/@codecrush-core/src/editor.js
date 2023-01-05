import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";

export class Editor {
  constructor() {
    this.editorContent = null;
    this.editorEl = null;
    this.textarea = null;
    this.isFocus = false;
    this.input = null;
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
    const lines = [];
    let lastLineBreakIndex = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] == "\n") {
        const line = value.slice(lastLineBreakIndex, i);
        lines.push(line);
        lastLineBreakIndex = i + 1;
      }
    }
    console.log(lines);
    this.editorContent.textContent = value;
  }
}
