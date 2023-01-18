import { keyCodeToChar } from "./characters";
import { Completion } from "./completion";
import { Component } from "./Component";
import { findQuery } from "./langs/typescript";

export class AutoCompletion extends Component {
  constructor() {
    super();
    this.results = [];
    this.completionEl = null;
    this.query = "";
  }

  onKeyPressed(key) {
    switch (key) {
      case "ArrowLeft":
        this.quit();
        break;
      case "Shift":
        break;
      case "ArrowUp":
        this.quit();
        break;
      case "ArrowDown":
        this.quit();
        break;
      case "ArrowRight":
        this.quit();
        break;
      case "PageDown":
        this.quit();
        break;
      case "PageUp":
        this.quit();
        break;
      case " ":
        this.quit();
        break;
      case "Backspace":
        this.quit();
        break;
      case "Enter":
        this.quit();
        break;
      case "Home":
        this.quit();
        break;
      case "End":
        this.quit();
        break;
      case "Tab":
        this.quit();
        break;
      default:
        const parsedValue = keyCodeToChar[key] ?? key;
        if (parsedValue == "") return;
        if (parsedValue.match(/[a-zA-Z0-9]/)) {
          this.search();
          this.render();
        }
        break;
    }
  }

  quit() {
    if (!this.completionEl) return;
    this.completionEl.quit();
  }

  search() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const lineContent = currentLine.getContent();

    const beforePosition = lineContent.substring(
      0,
      this.editor.currentPositionOnLine
    );
    const lastDelimiter = Math.max(beforePosition.lastIndexOf("."), beforePosition.lastIndexOf(' '));
    const currentWord = lineContent.slice(
      lastDelimiter + 1,
      this.editor.currentPositionOnLine
    );
    this.results = findQuery(currentWord);
  }

  render() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const linePos = currentLine.getPosition();
    const currentLineHeight = currentLine.getClientHeight();
    const autoCompletionTop = linePos.top + currentLineHeight + 5;
    const autoCompletionLeft = this.editor.cursor.getLeft();
    const editorWidth = this.editor.editorEl.getBoundingClientRect().width;

    // Create the autocompletion if not exist
    if (!this.completionEl) {
      const completionEl = new Completion(this.editor.preEl);
      this.completionEl = completionEl;
    }

    this.completionEl.render(
      editorWidth / 2,
      autoCompletionTop,
      autoCompletionLeft,
      this.results
    );
  }
}
