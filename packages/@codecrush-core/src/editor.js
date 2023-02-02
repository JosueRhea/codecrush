import { getHighlighter, setCDN } from "shiki";
import { Cursor } from "./cursor";
import { EditableInput } from "./editableInput";
import { Line } from "./line";

export class Editor {
  constructor({ theme, height, id, parent }) {
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
    this.id = id;
    this.parent = parent;
    this.lastTimePressed = new Date();
    this.lastTimeDiff = 100;
    this.isMouseDown = false;
    this.mouseDownOffsetStart = null;
    this.isMouseSelecting = false;
    this.prevent = { componentId: null };
  }

  async init() {
    //Parent element
    if (document.querySelector(`#${this.id}`)) {
      return;
    }
    const editor = document.createElement("div");
    editor.id = this.id;
    this.parent.appendChild(editor);
    editor.setAttribute("class", "codecrush-editor");
    editor.style.height = this.height + "px";
    editor.style.background = "#1b1e28";

    //Get the code
    setCDN("https://unpkg.com/shiki@0.12.1/");
    await getHighlighter({
      theme: this.selectedTheme,
      langs: ["js"],
    })
      .then((h) => {
        this.theme = h.getTheme();
        this.highlighter = h;
        this.codeToThemeTokens = (text) => {
          return h.codeToThemedTokens(text, "js", this.selectedTheme);
        };
      })
      .catch(() => {
        throw Error("Error loading the theme");
      });

    editor.style.background = this.theme.bg;
    editor.setAttribute("data-testid", "codecrush-container");
    editor.setAttribute("tabindex", "0");
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
    editor.style.setProperty(
      "--activityBar-foreground",
      this.theme.colors["activityBar.foreground"]
    );
    editor.style.setProperty(
      "--activityBar-background",
      this.theme.colors["activityBar.background"]
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

    this.preEl.addEventListener("mouseup", (e) => {
      this.prevent.componentId = null;
      this.mouseDownOffsetStart = null;
      this.isMouseDown = false;
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

    this.preEl.addEventListener("mousemove", (e) => {
      this.prevent.componentId = null;
      if (this.isMouseDown) {
        const clickY =
          e.clientY -
          this.preEl.getBoundingClientRect().top +
          this.preEl.scrollTop;
        const clickX =
          e.clientX -
          this.preEl.getBoundingClientRect().left +
          this.preEl.scrollLeft;

        const newOffset = clickY + clickX;
        if (this.mouseDownOffsetStart !== newOffset) {
          this.isMouseSelecting = true;
          this.onMouseClick(clickX, clickY);
        }
      }
    });

    this.preEl.addEventListener("mousedown", (e) => {
      this.prevent.componentId = null;
      this.isMouseDown = true;
      this.isMouseSelecting = false;
      const clickY =
        e.clientY -
        this.preEl.getBoundingClientRect().top +
        this.preEl.scrollTop;
      const clickX =
        e.clientX -
        this.preEl.getBoundingClientRect().left +
        this.preEl.scrollLeft;
      this.mouseDownOffsetStart = clickX + clickY;

      this.onMouseClick(clickX, clickY);
    });

    // Input
    const hiddenInput = new EditableInput();
    this.editorEl.addEventListener("click", (e) => {
      if (!this.isFocus) {
        hiddenInput.focus();
        this.isFocus = true;
        this.editorEl.classList.add("codecrush-editor-focused");
        this.cursor.activate();
      }
    });

    hiddenInput.onChange((e, withCtrlKey, shiftKey) => {
      this.prevent.componentId = null;
      this.onKeyPressed(e, withCtrlKey, shiftKey);
    });

    hiddenInput.onBlur((e) => {
      this.isFocus = false;
      this.editorEl.classList.remove("codecrush-editor-focused");
      this.cursor.deactivate();
    });

    this.isLoaded = true;
    editor.setAttribute("editor-loaded", true);
    this.handleLastPressed();
    this.onReady();
  }

  handleLastPressed() {
    setInterval(() => {
      if (this.isFocus) {
        const currentTime = new Date();
        const diff = currentTime.getTime() - this.lastTimePressed.getTime();
        if (diff > 200) {
          this.cursor.enableAnimation();
        } else {
          this.cursor.disableAnimation();
        }
      }
    }, 200);
  }

  runComponents(functionName, ...args) {
    for (const component of this.components) {
      if (this.prevent.componentId != null) {
        if (component.id === this.prevent.componentId) {
          component[functionName](...args);
        }
      } else {
        component[functionName](...args);
      }
    }
  }

  preventDefault(id) {
    this.prevent.componentId = id;
  }

  onMouseDrag() {
    this.runComponents("onMouseDrag");
  }

  onMouseClick(clickX, clickY) {
    this.runComponents("onMouseClick", clickX, clickY);
  }

  onKeyPressed(e, withCtrlKey, shiftKey) {
    this.lastTimePressed = new Date();
    this.runComponents("onKeyPressed", e, withCtrlKey, shiftKey);
  }
  onCharacterDelete() {
    this.runComponents("onCharacterDelete");
  }

  onNewLine() {
    this.runComponents("onNewLine");
  }

  onLineIndexChange() {
    this.runComponents("onLineIndexChange");
  }

  onDeleteLine(positionOnLine) {
    this.runComponents("onDeleteLine", positionOnLine);
  }

  onPositionChange(data) {
    this.runComponents("onPositionChange", data);
  }

  onCompletionAccept(completion) {
    this.runComponents("onCompletionAccept", completion);
  }

  onSearchSuggestions() {
    this.runComponents("onSearchSuggestions");
  }

  onAutoCompletionCancel() {
    this.runComponents("onAutoCompletionCancel");
  }

  onTextAdded(text) {
    this.runComponents("onTextAdded", text);
  }

  onChange() {
    this.runComponents("onChange");
  }

  onReady() {
    this.runComponents("onReady");
  }

  use(component) {
    this.components.push(component);
    component.editor = this;
  }

  getComponent(componentId) {
    return this.components.find((x) => x.id === componentId);
  }
}
