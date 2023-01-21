import { keyCodeToChar } from "./characters";
import { Component } from "./Component";
import { Line } from "./line";
import { insertInto } from "./utils/array";

export class TextEditor extends Component {
  constructor() {
    super();
  }

  onKeyPressed(key) {
    switch (key) {
      case "Backspace":
        if (this.editor.editorSelection.length > 0) {
          this.editor.editorSelection.forEach((line) => {
            this.deleteCharacterInRange(line.lineIndex, line.start, line.end);
          });
        } else {
          this.deleteCharacter(this.editor.codeToThemeTokens);
        }
        break;
      case "Enter":
        if (this.editor.isAutoCompleting) break;
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
    currLine.appendText(
      parsedValue,
      this.editor.currentPositionOnLine,
      this.editor.codeToThemeTokens
    );
  }

  deleteCharacterInRange(lineIndex, start, end) {
    const line = this.editor.lines[lineIndex];
    for (let i = line.getLength(); i >= 0; i--) {
      if (i > start && i <= end) {
        this.deleteCharacterByLineIndex(lineIndex, i);
      }
    }
  }

  deleteCharacterByLineIndex(lineIndex, position) {
    const currentLine = this.editor.lines[lineIndex];
    if (currentLine.isEmpty()) {
      if (lineIndex > 0) {
        console.log("TODO: delete line for selection");
        // this.deleteLine(lineIndex);
      }
    } else {
      if (position >= 0) {
        currentLine.deleteCharacter(position, this.editor.codeToThemeTokens);
        // this.editor.onCharacterDelete();
      } else {
        if (lineIndex > 0) {
          console.log("TODO: give content to line for selection");
          // const lineToAppend = this.editor.lines[lineIndex - 1];
          // const newPosition = lineToAppend.getLength();
          // currentLine.giveContentTo(lineToAppend, this.editor.highlighter);
          // this.deleteLine(lineIndex, newPosition);
        }
      }
    }
  }

  deleteCharacter() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (currentLine.isEmpty()) {
      if (this.editor.currentLineIndex > 0) {
        this.deleteLine(this.editor.currentLineIndex);
      }
    } else {
      if (this.editor.currentPositionOnLine > 0) {
        currentLine.deleteCharacter(
          this.editor.currentPositionOnLine,
          this.editor.codeToThemeTokens
        );
        this.editor.onCharacterDelete();
      } else {
        if (this.editor.currentLineIndex > 0) {
          const lineToAppend =
            this.editor.lines[this.editor.currentLineIndex - 1];
          const newPosition = lineToAppend.getLength();
          currentLine.giveContentTo(lineToAppend, this.editor.codeToThemeTokens);
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
      currentLineEl.deleteCharacterAfter(position, this.editor.codeToThemeTokens);
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
      newLine.appendText(contentAfterPosition, 0, this.editor.codeToThemeTokens);
      this.editor.onNewLine();
    }
  }

  deleteLine(currentLineIndex, position) {
    const currentLine = this.editor.lines[currentLineIndex];
    if (currentLine) {
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
      const newCurrentLine =
        this.editor.lines[this.editor.currentLineIndex - 1];
      newCurrentLine.setIsActive(true);
      const length = position ? position : newCurrentLine.getLength();
      this.editor.onDeleteLine(length);
    }
  }

  recomputeLineNumbers() {
    this.editor.lines.forEach((line, i) => {
      line.changeLineNumber(i);
    });
  }

  onCompletionAccept(completion) {
    this.addCharacter(completion);
  }
}
