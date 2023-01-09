import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";
import { Line } from "./line";

export class Editor {
  constructor() {
    this.components = [];
    this.editorContent = null;
    this.editorEl = null;
    this.preEl = null;
    this.isFocus = false
    this.lineNumbersEl = false
    this.lines = []
    this.cursor = null
    this.currentLineIndex = 0
    this.currentPositionOnLine = 0
  }

  init() {
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
    const firstLine = new Line(code, "", 0, 0);
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

    // Input
    const hiddenInput = new EditableInput();
    this.editorEl.addEventListener("click", () => {
      if (!this.isFocus) {
        hiddenInput.focus();
        this.isFocus = true;
        this.editorEl.classList.add("focused");
      }
    });

    hiddenInput.onChange((e) => {
      this.onKeyPressed(e)
    });

    hiddenInput.onBlur((e) => {
      this.isFocus = false;
      this.editorEl.classList.remove("focused");
    });
  }

  onKeyPressed(e) {
    for (const component of this.components) {
      if (component.onKeyPressed) {
        component.onKeyPressed(e);
      }
    }
  }

  onCharacterDelete(){
    for (const component of this.components) {
      if (component.onCharacterDelete) {
        component.onCharacterDelete();
      }
    }
  }

  onNewLine(){
    for (const component of this.components) {
      if (component.onNewLine) {
        component.onNewLine();
      }
    }
  }

  onDeleteLine(positionOnLine){
    for (const component of this.components) {
      if (component.onDeleteLine) {
        component.onDeleteLine(positionOnLine);
      }
    }
  }

  use(component) {
    this.components.push(component);
    component.editor = this;
  }
}
