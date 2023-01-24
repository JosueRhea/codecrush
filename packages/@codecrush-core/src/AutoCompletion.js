import { keyCodeToChar } from "./characters";
import { Completion } from "./completion";
import { Component } from "./Component";
import debounce from "./utils/debounce";

export class AutoCompletion extends Component {
  constructor() {
    super('autocompletion');
    this.results = [];
    this.completionEl = null;
    this.query = "";
    this.currentWord = "";
    this.resultIndex = 0;
    this.getResultsFromAi = debounce(() => {
      if (this.editor.cohereToken) {
        this.fetchAutoCompletions(this.currentWord)
          .then((res) => res.json())
          .then((data) => {
            this.results = data.generations[0].text
              .replace("\n", "")
              .replace("---", "")
              .split(",")
              .map((x) => x.trim())
              .filter((x) => x !== "");
            this.render();
          });
      }
    }, 500);
  }

  onKeyPressed(key) {
    switch (key) {
      case "ArrowLeft":
        this.quit();
        break;
      case "Shift":
        break;
      case "ArrowUp":
        if (this.editor.isAutoCompleting) {
          this.moveUp();
        }
        break;
      case "ArrowDown":
        if (this.editor.isAutoCompleting) {
          this.moveDown();
        }
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
        if (this.editor.isAutoCompleting) {
          if (this.results.length > 0) {
            this.editor.onCompletionAccept(
              this.results[this.resultIndex].substring(this.currentWord.length)
            );
            this.editor.isAutoCompleting = false;
            this.resultIndex = 0;
          }
        }
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
        }
        break;
    }
  }

  quit() {
    if (!this.completionEl) return;
    this.completionEl.quit();
    this.editor.isAutoCompleting = false;
    this.resultIndex = 0;
  }

  async fetchAutoCompletions(currentWord) {
    return fetch("https://api.cohere.ai/generate", {
      method: "POST",
      headers: {
        "Cohere-Version": "2022-12-06",
        accept: "application/json",
        authorization: `Bearer ${this.editor.cohereToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        max_tokens: 20,
        return_likelihoods: "NONE",
        truncate: "END",
        prompt: `this program returns text autocompletions for code editor, it can have multiple autocompletions and should only return javascript code like this
        input:spl
        autocompletion:splice,slice
        ---
        input:con
        autocompletion:const,console,continue
        ---
        input:for
        autocompletion:for(let i = 0; i < array.length, i++),forEach,for(const a in array)
        ---
        input:${currentWord}
        autocompletion:`,
      }),
    });
  }

  search() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    const lineContent = currentLine.getContent();

    const beforePosition = lineContent.substring(
      0,
      this.editor.currentPositionOnLine
    );
    const lastDelimiter = Math.max(
      beforePosition.lastIndexOf("."),
      beforePosition.lastIndexOf(" ")
    );
    const currentWord = lineContent.slice(
      lastDelimiter + 1,
      this.editor.currentPositionOnLine
    );
    this.currentWord = currentWord;
    this.getResultsFromAi();
  }

  moveDown() {
    if (this.resultIndex < this.results.length - 1) {
      this.completionEl.removeActive(this.resultIndex);
      this.resultIndex += 1;
      this.completionEl.addActive(this.resultIndex);
    } else {
      this.completionEl.removeActive(this.resultIndex);
      this.resultIndex = 0;
      this.completionEl.addActive(this.resultIndex);
    }
  }

  moveUp() {
    if (this.resultIndex > 0) {
      this.completionEl.removeActive(this.resultIndex);
      this.resultIndex -= 1;
      this.completionEl.addActive(this.resultIndex);
    } else {
      this.completionEl.removeActive(this.resultIndex);
      this.resultIndex = this.results.length - 1;
      this.completionEl.addActive(this.resultIndex);
    }
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

    this.editor.isAutoCompleting = this.results.length > 0;

    this.completionEl.render(
      editorWidth / 2,
      autoCompletionTop,
      autoCompletionLeft,
      this.results
    );
  }
}
