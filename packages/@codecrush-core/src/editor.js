import { specialKeys, keyCodeToChar } from "./characters";
import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";
import { Actions } from './actions'

export class Editor {
  constructor() {
    this.editorContent = null;
    this.editorEl = null;
    this.textarea = null;
    this.isFocus = false;
    this.input = null;
    this.actions = new Actions()
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
    if(value == "Backspace"){
      const newValue = this.actions.deleteCharacter(this.editorContent.textContent) 
      this.editorContent.textContent = newValue

    }else{
      const parsedValue = keyCodeToChar[value] ?? value
    this.editorContent.textContent += parsedValue
    }
  }
}
