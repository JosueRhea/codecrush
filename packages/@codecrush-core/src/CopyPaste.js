import { Component } from "./Component";

export class CopyPaste extends Component {
  constructor() {
    super("copy-paste");
  }

  onReady() {
    const shorcuts = this.editor.getComponent("shortcuts");
    shorcuts.register({ withCtrl: true, key: "c" }, () => {
      this.copyToClipboard();
    });
    shorcuts.register({ withCtrl: true, key: "x" }, () => {
      this.cutToClipboard();
    });
  }

  copyToClipboard() {
    if (this.editor.editorSelection.length > 0) {
      const clipboardContent = [];
      this.editor.editorSelection.forEach((line) => {
        const content = this.editor.lines[line.lineIndex].getContentRange(
          line.start,
          line.end
        );
        clipboardContent.push({ lineIndex: line.lineIndex, content });
      });
      clipboardContent.sort((a, b) => a.lineIndex - b.lineIndex);
      const dataToSave = this.formatClipboadContent(clipboardContent);
      this.saveIntoClipboard(dataToSave);
    }
  }

  cutToClipboard() {
    if (this.editor.editorSelection.length > 0) {
      const textEditor = this.editor.getComponent("text-editor");
      const clipboardContent = [];
      this.editor.editorSelection.forEach((line) => {
        const content = this.editor.lines[line.lineIndex].getContentRange(
          line.start,
          line.end
        );
        textEditor.deleteCharacterInRange(line.lineIndex, line.start, line.end);
        clipboardContent.push({ lineIndex: line.lineIndex, content });
      });
      const selection = this.editor.getComponent("selection");
      selection.deselectText();
      clipboardContent.sort((a, b) => a.lineIndex - b.lineIndex);
      const dataToSave = this.formatClipboadContent(clipboardContent);
      this.saveIntoClipboard(dataToSave);
    }
  }

  async saveIntoClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  formatClipboadContent(data) {
    return data
      .map((line) => {
        return line.content;
      })
      .join("\n");
  }
}
