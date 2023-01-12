import { Component } from "./Component";

export class Selection extends Component {
  constructor() {
    super();
    this.range = null;
  }

  onKeyPressed(key, _, shiftKey) {
    switch (key) {
      case "ArrowLeft":
        if (shiftKey) {
          this.selectTextToLeft();
        } else {
          this.deselectText();
        }
        break;
      case "ArrowRight":
        if (shiftKey) {
          this.selectTextToRight();
        } else {
          this.deselectText();
        }
        break;
      default:
        this.deselectText();
        break;
    }
  }

  // selectTextToUp() {
  //   if (this.editor.currentLineIndex + 1 > 0) {
  //     // const currentLine = this.editor.lines[this.editor.currentLineIndex];
  //     // if(this.editor.lastCurrentPositionOnLine > )
  //     this.selectAllLineToLeftFrom(
  //       this.editor.lastCurrentPositionOnLine,
  //       this.editor.lines[this.editor.currentLineIndex + 1]
  //     );
  //   }
  // }

  selectTextToRight() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.isSelecting && currentLine.selection) {
      // currentLine.selection.start = this.editor.currentPositionOnLine;
      // currentLine.selection.width = currentLine.getOffsetSumRange(
      //   currentLine.selection.start,
      //   currentLine.selection.end
      // );
      // currentLine.selection.left = currentLine.getOffsetSum(
      //   this.editor.currentPositionOnLine
      // );
      // this.renderSelection(currentLine);
    } else {
      this.editor.isSelecting = true;
      if (this.editor.currentPositionOnLine == currentLine.getLength()) {
        currentLine.selection = {
          start: this.editor.currentPositionOnLine,
          end: this.editor.currentPositionOnLine,
        };

        currentLine.selection.width = currentLine.getOffsetSumRange(
          currentLine.selection.start,
          currentLine.selection.end
        );

        currentLine.selection.left = currentLine.getOffsetSum(
          this.editor.currentPositionOnLine
        );
        this.renderSelection(currentLine);
      } else {
        currentLine.selection = {
          start: this.editor.currentPositionOnLine - 1,
          end: this.editor.currentPositionOnLine,
        };

        currentLine.selection.width = currentLine.getOffsetSumRange(
          currentLine.selection.start,
          currentLine.selection.end
        );

        currentLine.selection.left = currentLine.getOffsetSum(
          this.editor.currentPositionOnLine
        );
        this.renderSelection(currentLine);
      }
    }
  }

  selectTextToLeft() {
    const currentLine = this.editor.lines[this.editor.currentLineIndex];
    if (this.editor.isSelecting && currentLine.selection) {
      currentLine.selection.start = this.editor.currentPositionOnLine;
      currentLine.selection.width = currentLine.getOffsetSumRange(
        currentLine.selection.start,
        currentLine.selection.end
      );
      currentLine.selection.left = currentLine.getOffsetSum(
        this.editor.currentPositionOnLine
      );
      this.renderSelection(currentLine);
    } else {
      this.editor.isSelecting = true;
      if (this.editor.currentPositionOnLine == currentLine.getLength()) {
        currentLine.selection = {
          start: this.editor.currentPositionOnLine,
          end: this.editor.currentPositionOnLine,
        };

        currentLine.selection.width = currentLine.getOffsetSumRange(
          currentLine.selection.start,
          currentLine.selection.end
        );

        currentLine.selection.left = currentLine.getOffsetSum(
          this.editor.currentPositionOnLine
        );
        this.renderSelection(currentLine);
      } else {
        currentLine.selection = {
          start: this.editor.currentPositionOnLine,
          end: this.editor.currentPositionOnLine + 1,
        };

        currentLine.selection.width = currentLine.getOffsetSumRange(
          currentLine.selection.start,
          currentLine.selection.end
        );

        currentLine.selection.left = currentLine.getOffsetSum(
          this.editor.currentPositionOnLine
        );
        this.renderSelection(currentLine);
      }
    }
  }

  selectAllLineToLeftFrom(position, line) {
    if (this.editor.isSelecting && line.selection) {
    } else {
      this.editor.isSelecting = true;
      line.selection = {
        start: 0,
        end: position,
      };

      line.selection.width = line.getOffsetSumRange(
        line.selection.start,
        line.selection.end
      );

      line.selection.left = line.getOffsetSum(0);
      console.log(line.selection);
      this.renderSelection(line);
    }
  }

  onLineIndexChange() {
    if (this.editor.isSelecting) {
    }
  }

  deselectText() {
    console.log("Calling deselect");
    if (this.editor.isSelecting) {
      this.editor.isSelecting = false;
      this.editor.lines.forEach((line) => {
        if (line.selection) {
          line.selection = null;
          line.selectionEl.style.top = "";
          line.selectionEl.style.left = "";
          line.selectionEl.style.width = "";
          line.selectionEl.style.height = "";
        }
      });
    }
  }

  renderSelection(line) {
    const linePos = line.getPosition();
    if (line.selection) {
      line.selectionEl.style.top = linePos.top + "px";
      line.selectionEl.style.left = linePos.left + line.selection.left + "px";
      line.selectionEl.style.width = line.selection.width + "px";
      line.selectionEl.style.height = line.getClientHeight() + "px";
    }
  }
}
