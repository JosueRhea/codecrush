import { getHighlighter, setCDN } from "shiki";
import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";
import { Line } from "./line";

export class Editor {
  constructor({ theme, height }) {
    this.components = [];
    this.editorContent = null;
    this.editorEl = null;
    this.preEl = null;
    this.isFocus = false;
    this.lineNumbersEl = false;
    this.lines = [];
    this.cursor = null;
    this.currentLineIndex = 0;
    this.currentPositionOnLine = 0;
    this.highlighter = null;
    this.isLoaded = false;
    this.theme = null;
    this.linesInViewport = null;
    this.isSelecting = false;
    this.editorSelection = [];
    this.isAutoCompleting = false;
    this.selectedTheme = theme ?? "poimandres";
    this.height = height ?? null;
  }

  async init() {
    //Get the code
    setCDN("https://unpkg.com/shiki/");
    await getHighlighter({
      theme: this.selectedTheme,
      langs: ["js"],
    }).then((h) => {
      this.theme = h.getTheme();
      console.log(this.theme);
      this.highlighter = h;
      this.codeToThemeTokens = (text) => {
        return h.codeToThemedTokens(text, "js", this.selectedTheme);
      };
    });
    //Parent element
    const editor = document.createElement("div");
    editor.setAttribute("class", "codecrush-editor");
    editor.setAttribute("tabindex", "0");
    editor.style.height = this.height + "px";
    editor.style.setProperty("--editor-theme-bg", this.theme.bg);
    editor.style.setProperty(
      "--editor-editorLineNumber-foreground",
      this.theme.colors["editorLineNumber.foreground"]
    );
    editor.style.setProperty(
      "--editor-editorLineNumber-activeForeground",
      this.theme.colors["editorLineNumber.activeForeground"]
    );
    editor.style.setProperty(
      "--editorSuggestWidget-background",
      this.theme.colors["editorSuggestWidget.background"]
    );
    editor.style.setProperty(
      "--editorSuggestWidget-selectedBackground",
      this.theme.colors["editorSuggestWidget.selectedBackground"]
    );

    // Pre element
    const pre = document.createElement("pre");
    pre.style.position = "relative";
    pre.setAttribute("class", "text-editor-content");
    editor.appendChild(pre);

    //Lines
    const lineNumbers = document.createElement("div");
    lineNumbers.classList.add("line-numbers");
    // lineNumbers.style.color = this.theme.colors["editorLineNumber.foreground"];
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
    const realHeight = this.preEl.getBoundingClientRect().height - 20;

    this.linesInViewport = realHeight / firstLine.getClientHeight();

    //cursor
    const cursor = new Cursor(
      pre,
      linePos,
      lineHeight,
      this.theme.colors["editorCursor.foreground"]
    );
    this.cursor = cursor;

    this.editorEl.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    this.preEl.addEventListener("mousedown", (e) => {
      const clickY =
        e.clientY -
        this.preEl.getBoundingClientRect().top +
        this.preEl.scrollTop;
      const clickX =
        e.clientX -
        this.preEl.getBoundingClientRect().left +
        this.preEl.scrollLeft;

      this.onMouseClick(clickX, clickY);
    });

    // Input
    const hiddenInput = new EditableInput();
    this.editorEl.addEventListener("click", (e) => {
      if (!this.isFocus) {
        hiddenInput.focus();
        this.isFocus = true;
        this.editorEl.classList.add("codecrush-editor-focused");
      }
    });

    hiddenInput.onChange((e, withCtrlKey, shiftKey) => {
      this.onKeyPressed(e, withCtrlKey, shiftKey);
    });

    hiddenInput.onBlur((e) => {
      this.isFocus = false;
      this.editorEl.classList.remove("codecrush-editor-focused");
    });

    this.isLoaded = true;
    console.log("loaded");
  }

  onMouseClick(clickX, clickY) {
    for (const component of this.components) {
      if (component.onMouseClick) {
        component.onMouseClick(clickX, clickY);
      }
    }
  }

  onKeyPressed(e, withCtrlKey, shiftKey) {
    for (const component of this.components) {
      if (component.onKeyPressed) {
        component.onKeyPressed(e, withCtrlKey, shiftKey);
      }
    }
  }

  onCharacterDelete() {
    for (const component of this.components) {
      if (component.onCharacterDelete) {
        component.onCharacterDelete();
      }
    }
  }

  onNewLine() {
    for (const component of this.components) {
      if (component.onNewLine) {
        component.onNewLine();
      }
    }
  }

  onLineIndexChange() {
    for (const component of this.components) {
      if (component.onNewLine) {
        component.onLineIndexChange();
      }
    }
  }

  onDeleteLine(positionOnLine) {
    for (const component of this.components) {
      if (component.onDeleteLine) {
        component.onDeleteLine(positionOnLine);
      }
    }
  }

  onPositionChange(data) {
    for (const component of this.components) {
      if (component.onPositionChange) {
        component.onPositionChange(data);
      }
    }
  }

  onCompletionAccept(completion) {
    for (const component of this.components) {
      if (component.onCompletionAccept) {
        component.onCompletionAccept(completion);
      }
    }
  }

  use(component) {
    this.components.push(component);
    component.editor = this;
  }
}
