import { Component } from "./Component";
import debounce from "./utils/debounce";

export class HistoryChanges extends Component {
  constructor() {
    super("history-changes");
    this.history = [];
    this.pointer = 0;
  }

  onReady() {
    this.saveToHistory = debounce(() => {
      const linesClone = this.editor.lines.map((line) => {
        return line.clone();
      });
      this.history.push(linesClone);
      this.pointer = this.history.length - 1;
    }, 200);

    this.saveToHistory();

    //Register shortcut
    const shorcuts = this.editor.getComponent("shortcuts");
    shorcuts.register({ withCtrl: true, key: "z" }, () => {
      this.backToBefore();
    });
    shorcuts.register({ withCtrl: true, key: "y" }, () => {
      this.backToForward();
    });
  }

  backToBefore() {
    if (this.pointer > 0) {
      const textEditor = this.editor.getComponent("text-editor");
      this.pointer--;
      this.history[this.pointer].forEach((line) => {
        const editorLine = this.editor.lines[line.index];
        if (editorLine) {
          textEditor.deleteCharacterInRange(
            line.index,
            0,
            editorLine.getLength()
          );
          textEditor.addCharacterByLineIndex(line.content, line.index);
        }
      });
    }
  }

  backToForward() {
    if (this.pointer < this.history.length - 1) {
      const textEditor = this.editor.getComponent("text-editor");
      this.pointer++;
      this.history[this.pointer].forEach((line) => {
        const editorLine = this.editor.lines[line.index];
        if (editorLine) {
          textEditor.deleteCharacterInRange(
            line.index,
            0,
            editorLine.getLength()
          );
          textEditor.addCharacterByLineIndex(line.content, line.index);
        }
      });
    }
  }

  onChange() {
    this.saveToHistory();
  }
}
