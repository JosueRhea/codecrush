import { Component } from "./Component";

export class Selection extends Component {
  constructor() {
    super();
    this.range = null;
    this.isShiftKey = false;
  }

  onKeyPressed(key, _, shiftKey) {
    if (shiftKey) this.isShiftKey = true;
    else {
      this.isShiftKey = false;
      this.deselectText();
    }
  }

  onPositionChange(data) {
    if (!this.isShiftKey) return;
    const lineBeforeIndex = data.before.line.index;
    const positionBeforeIndex = data.before.line.position;
    const lineAfterIndex = data.after.line.index;
    const positionAfterIndex = data.after.line.position;

    const IS_LEFT = positionBeforeIndex > positionAfterIndex;
    const IS_RIGHT = positionBeforeIndex < positionAfterIndex;
    // const IS_LEFT_UP = lineBeforeIndex > lineAfterIndex && positionBeforeIndex == 0
    const IS_UP = lineBeforeIndex > lineAfterIndex;
    // const IS_RIGHT_WITH_LEFT_SELECTION = IS_LEFT &&

    console.log({ before: data.before, after: data.after });
    console.log(this.editor.editorSelection);

    if (IS_LEFT) {
      this.selectTextToLeft(
        lineBeforeIndex,
        positionAfterIndex,
        positionBeforeIndex
      );
    }

    if (IS_RIGHT) {
      this.selectTextToRight(
        lineBeforeIndex,
        positionBeforeIndex,
        positionAfterIndex
      );
    }

    // if(IS_LEFT_UP){
    //   this.selectTextToUp(
    //     lineBeforeIndex,
    //     positionBeforeIndex,
    //     lineAfterIndex,
    //     positionAfterIndex - 1
    //   );
    // }

    if (IS_UP) {
      this.selectTextToUp(
        lineBeforeIndex,
        positionBeforeIndex,
        lineAfterIndex,
        positionAfterIndex
      );
    }
  }

  selectTextToUp(
    lineBeforeIndex,
    positionBeforeIndex,
    lineAfterIndex,
    positionAfterIndex
  ) {
    const afterLine = this.editor.lines[lineAfterIndex];
    const length = afterLine.getLength();
    this.selectTextToLeft(lineBeforeIndex, 0, positionBeforeIndex);
    this.selectTextToLeft(lineAfterIndex, positionAfterIndex, length);
  }

  selectTextToLeft(lineIndex, start, end) {
    const currentLine = this.editor.lines[lineIndex];
    const lineExistInSelectionIndex = this.editor.editorSelection.findIndex(
      (n) => n.lineIndex === lineIndex
    );
    if (this.editor.isSelecting && lineExistInSelectionIndex !== -1) {
      const lineSelection =
        this.editor.editorSelection[lineExistInSelectionIndex];
      lineSelection.start = start;
      const width = currentLine.getOffsetSumRange(
        lineSelection.start,
        lineSelection.end
      );
      const left = currentLine.getOffsetSum(lineSelection.start);
      lineSelection.width = width;
      lineSelection.left = left;
      this.renderSelection();
    } else {
      this.editor.isSelecting = true;
      const selection = {
        lineIndex: lineIndex,
        start: start,
        end: end,
      };
      const width = currentLine.getOffsetSumRange(
        selection.start,
        selection.end
      );
      const left = currentLine.getOffsetSum(selection.start);
      selection.width = width;
      selection.left = left;
      this.editor.editorSelection.push(selection);
      this.renderSelection();
    }
  }

  selectTextToRight(lineIndex, start, end) {
    const currentLine = this.editor.lines[lineIndex];
    const lineExistInSelectionIndex = this.editor.editorSelection.findIndex(
      (n) => n.lineIndex === lineIndex
    );
    if (this.editor.isSelecting && lineExistInSelectionIndex !== -1) {
      const lineSelection =
        this.editor.editorSelection[lineExistInSelectionIndex];
      lineSelection.end = end;
      const width = currentLine.getOffsetSumRange(
        lineSelection.start,
        lineSelection.end
      );
      const left = currentLine.getOffsetSum(lineSelection.start);
      lineSelection.width = width;
      lineSelection.left = left;
      this.renderSelection();
    } else {
      this.editor.isSelecting = true;
      const selection = {
        lineIndex: lineIndex,
        start: start,
        end: end,
      };
      const width = currentLine.getOffsetSumRange(
        selection.start,
        selection.end
      );
      const left = currentLine.getOffsetSum(selection.start);
      selection.width = width;
      selection.left = left;
      this.editor.editorSelection.push(selection);
      this.renderSelection();
    }
  }

  deselectText() {
    if (this.editor.isSelecting) {
      this.editor.isSelecting = false;
      this.editor.editorSelection.forEach(({ lineIndex }) => {
        const line = this.editor.lines[lineIndex];
        line.selection = null;
        line.selectionEl.style.top = "";
        line.selectionEl.style.left = "";
        line.selectionEl.style.width = "";
        line.selectionEl.style.height = "";
      });
      this.editor.editorSelection.length = 0;
    }
  }

  renderSelection() {
    this.editor.editorSelection.forEach(({ lineIndex, width, left }) => {
      const line = this.editor.lines[lineIndex];
      const linePos = line.getPosition();
      line.selectionEl.style.top = linePos.top + "px";
      line.selectionEl.style.left = linePos.left + left + "px";
      line.selectionEl.style.width = width + "px";
      line.selectionEl.style.height = line.getClientHeight() + "px";
    });
  }
}
