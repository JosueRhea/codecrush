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
      this.history.push(this.editor.lines);
      this.pointer = this.history.length;
    }, 500);

    //Register shortcut
    const shorcuts = this.editor.getComponent("shortcuts");
    shorcuts.register({ withCtrl: true, key: "c" }, () => {
      console.log("Copy command");
    });
  }

  onChange() {
    this.saveToHistory();
    console.log(this.history);
  }
}
