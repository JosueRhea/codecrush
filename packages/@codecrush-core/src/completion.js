export class Completion {
  constructor(preEl) {
    this.preEl = preEl;
    this.element = null;
    this.init();
  }

  init() {
    const el = document.createElement("div");
    this.preEl.appendChild(el);
    this.element = el;
  }

  render(width, top, left) {
    this.element.classList.add("autocompletion");
    this.element.style.top = top + "px";
    this.element.style.width = width + "px";
    this.element.style.height = 200 + "px";
    this.element.style.left = left + "px";
  }

  quit(){
    this.element.classList.add("autocompletion");
    this.element.style.top = 0;
    this.element.style.width = 0;
    this.element.style.height = 0;
    this.element.style.left = 0;
  }
}
