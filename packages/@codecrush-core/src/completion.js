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

  render(width, top, left, results) {
    this.element.classList.add("autocompletion");
    this.element.style.top = top + "px";
    this.element.style.width = width + "px";
    this.element.style.left = left + "px";
    this.element.innerHTML = "";

    if (results.length > 0) {
      results.forEach((result) => {
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("autocompletion-result");
        buttonEl.textContent = result;
        buttonEl.value = result;
        this.element.appendChild(buttonEl);
      });
    }
  }

  quit() {
    this.element.classList.add("autocompletion");
    this.element.innerHTML = "";
    this.element.style.top = 0;
    this.element.style.width = 0;
    this.element.style.left = 0;
  }
}
