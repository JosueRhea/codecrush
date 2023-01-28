import { Component } from "./Component";
import debounce from "./utils/debounce";

export class HistoryChanges extends Component {
  constructor() {
    super("history-changes");
    this.history = [];
    this.pointer = 0;

    this.init();
  }

  init() {
    this.saveToHistory = debounce(() => {
      this.history.push(this.editor.lines);
      this.pointer = this.history.length;
    }, 500);
  }

  onChange() {
    this.saveToHistory();
    console.log(this.history)
  }
}
