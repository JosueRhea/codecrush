import { Component } from "./Component";
import { loadingIcon } from "./icons";

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
    if (child) {
      this.barEl.removeChild(child);
    }
  }
  registerActivity(id, text, isLoading) {
    const element = document.createElement("p");
    element.id = id;
    element.textContent = text;
    if(isLoading){
      element.innerHTML += loadingIcon
    }
    this.barEl.appendChild(element);
  }
}
