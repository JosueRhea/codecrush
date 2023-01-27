import { Component } from "./Component";

export class HistoryChanges extends Component {
  constructor() {
    super("history-changes");
  }
  onTextAdded(options) {
    console.log(options);
  }
}
