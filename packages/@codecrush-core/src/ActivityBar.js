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
    el.setAttribute("data-testid", "activity-bar");
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
  updateActivity(id, text, isLoading) {
    const element = document.getElementById(id);
    if (!element) return;
    if (isLoading) {
      element.innerHTML = "";
      element.textContent = text;
      element.innerHTML += loadingIcon;
    } else {
      element.innerHTML = "";
      element.textContent = text;
    }
  }
  registerActivity(id, text, isLoading) {
    const element = document.createElement("p");
    element.id = id;
    element.textContent = text;
    if (isLoading) {
      element.innerHTML += loadingIcon;
    }
    this.barEl.appendChild(element);
  }
}
