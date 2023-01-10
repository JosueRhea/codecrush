import { getHighlighter } from "shiki";
import { setCDN } from "shiki";
import { keyCodeToChar } from "./characters";
import { Component } from "./Component";
import { Line } from "./line";
import { insertInto } from "./utils/array";

export class TextEditor extends Component {
  constructor() {
    super();
    this.init();
  }
  
  init() {
    setCDN("https://unpkg.com/shiki/");
    getHighlighter({
      theme: "nord",
      langs: ["javascript"],
    }).then((h) => {
      this.editor.highlighter = h
      console.log("highlighter loaded")
    });
  }
  
  onKeyPressed(key) {
    switch (key) {
      case "Backspace":
        this.deleteCharacter(this.editor.highlighter);
        break;
        case "Enter":
        this.createNewLine();
        break;
      default:
        this.addCharacter(key);
        break;
    }
  }

  addCharacter(key) {
    const parsedValue = keyCodeToChar[key] ?? key;
    if (parsedValue == "") return;
    const currLine = this.editor.lines[this.editor.currentLineIndex];
    currLine.appendText(parsedValue, this.editor.currentPositionOnLine, this.editor.highlighter);    
  }

  deleteCharacter() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (currentLine.isEmpty()) {
      if (this.editor.currentLineIndex > 0) {
        this.deleteLine(this.editor.currentLineIndex);
      }
    } else {
      if (this.editor.currentPositionOnLine > 0) {
        currentLine.deleteCharacter(this.editor.currentPositionOnLine, this.editor.highlighter);
        this.editor.onCharacterDelete();
      } else {
        if (this.editor.currentLineIndex > 0) {
          const lineToAppend =
            this.editor.lines[this.editor.currentLineIndex - 1];
          const newPosition = lineToAppend.getLength();
          currentLine.giveContentTo(lineToAppend);
          this.deleteLine(this.editor.currentLineIndex, newPosition);
        }
      }
    }
  }

  createNewLine() {
    //Deactivate the currrent line
    const currentLineEl = this.editor.lines[this.editor.currentLineIndex];
    currentLineEl.setIsActive(false);
    const position = this.editor.currentPositionOnLine;
    const contentAfterPosition = currentLineEl.getContentAfter(
      this.editor.currentPositionOnLine
    );

    if (!contentAfterPosition) {
      const nextIndex = this.editor.currentLineIndex + 1;
      const newLine = new Line(
        this.editor.editorContent,
        "",
        nextIndex,
        nextIndex
      );
      this.editor.lines = insertInto(this.editor.lines, nextIndex, newLine);
      newLine.setIsActive(true);
      this.recomputeLineNumbers();
      newLine.setLineNumber(this.editor.lineNumbersEl, nextIndex);      
      this.editor.onNewLine();
    } else {
      const nextIndex = this.editor.currentLineIndex + 1;
      currentLineEl.deleteCharacterAfter(position, this.editor.highlighter);
      const newLine = new Line(
        this.editor.editorContent,
        contentAfterPosition,
        nextIndex,
        nextIndex
      );
      this.editor.lines = insertInto(this.editor.lines, nextIndex, newLine);
      newLine.setIsActive(true);
      this.recomputeLineNumbers();
      newLine.setLineNumber(this.editor.lineNumbersEl, nextIndex);
      this.editor.onNewLine();
    }
  }

  deleteLine(currentLineIndex, position) {
    const currentLine = this.editor.lines[currentLineIndex];
    currentLine.setIsActive(false);
    currentLine.destroy();

    //Delete the line in the array
    this.editor.lines = this.editor.lines.reduce((acc, curr, i) => {
      if (i !== currentLineIndex) {
        acc.push(curr);
      }
      return acc;
    }, []);
    this.recomputeLineNumbers();
    const newCurrentLine = this.editor.lines[this.editor.currentLineIndex - 1];
    newCurrentLine.setIsActive(true);
    const length = position ? position : newCurrentLine.getLength();
    this.editor.onDeleteLine(length);
  }

  recomputeLineNumbers() {
    this.editor.lines.forEach((line, i) => {
      line.changeLineNumber(i);
    });
  }
}
