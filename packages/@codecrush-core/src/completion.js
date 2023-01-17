export class Completion {
  constructor(preEl, width, top, left) {
    this.preEl = preEl;
    this.width = width;
    this.top = top;
    this.left = left;
    this.init();
  }

  init() {
    const el = document.createElement("div");
    el.classList.add("autocompletion");
    el.style.top = this.top + "px";
    el.style.width = this.width + "px";
    el.style.height = 200 + "px";
    el.style.left = this.left + "px";
    this.preEl.appendChild(el);
  }
}
