import { EditableInput } from "./editableInput";

export class Editor {
  constructor() {
    this.editorContent = "";
    this.editorEl = null;
    this.textarea = null;
    this.isFocus = false;
    this.input = null;
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
    const hiddenInput = new EditableInput();
    this.editorEl.addEventListener("click", () => {
      hiddenInput.focus();
      this.isFocus = true;
      this.editorEl.classList.add('focused')
    });

    hiddenInput.onChange((e) => {
      console.log(e);
    });

    hiddenInput.onBlur(() => {
      this.isFocus = false;
      this.editorEl.classList.remove('focused')
    });
  }
}
