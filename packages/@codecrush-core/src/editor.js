import { EditableInput } from "./editableInput";

export class Editor {
  constructor() {
    this.editorContent = "";
    this.editorEl = null;
    this.textarea = null;
    this.isFocus = false;
  }

  #setupEditor() {
    const editor = document.createElement("div");
    editor.setAttribute("class", "text-editor");
    editor.setAttribute("tabindex", "0");
    document.body.appendChild(editor);
    this.editorEl = editor;
  }

  init() {
    this.#setupEditor();
    const input = new EditableInput();
    this.editorEl.addEventListener("click", () => {
      input.focus();
      this.isFocus = true;
    });

    input.onChange((e) => {
      console.log(e);
    });

    input.onBlur(() => {
      this.isFocus = false;
      console.log("Blur");
    });
  }
}
