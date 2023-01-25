import { Component } from "./Component";

export class ActivityBar extends Component {
  constructor() {
    super("activity-bar");
    this.barEl = null;

    this.init();
  }

  init() {
    const el = document.createElement("div");
    el.classList.add("activity-bar");
    this.barEl = el;
  }

  onReady() {
    this.editor.editorEl.appendChild(this.barEl);
  }

  removeActivity(id) {
    const child = document.getElementById(id);
    this.barEl.removeChild(child);
  }

  registerActivity(id, text) {
    const span = document.createElement("span");
    span.id = id;
    span.textContent = text;
    this.barEl.appendChild(span);
  }
}
