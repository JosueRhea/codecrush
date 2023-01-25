export class Component {
  constructor(id) {
    this.editor = null;
    this.id = id;
  }

  onKeyPressed(data, withCtrlKey, shiftKey) {}

  onCharacterDelete() {}

  onNewLine() {}

  onDeleteLine(positionOnLine) {}

  onLineIndexChange() {}

  onPositionChange(data) {}

  onMouseClick(clickX, clickY) {}

  onCompletionAccept(completion) {}

  onSearchSuggestions(cb) {}

  onReady() {}
}
