import { keyCodeToChar } from "./characters";
import { Component } from "./Component";

export class TextEditor extends Component {
  constructor() {
    super();
  }

  onKeyPressed(key) {
    const parsedValue = keyCodeToChar[key] ?? key;
    if (parsedValue == "") return;
    const currLine = this.editor.lines[this.editor.currentLineIndex];    
    currLine.appendText(parsedValue, this.editor.currentPositionOnLine);
  }
}
