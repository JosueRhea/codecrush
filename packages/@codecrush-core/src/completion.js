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
      results.forEach((result, i) => {
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("autocompletion-result");
        if (i == 0) buttonEl.classList.add("active");
        const completion = document.createElement('span')
        const owner = document.createElement('owner')
        owner.classList.add('owner')
        completion.textContent = result.suggestion
        owner.textContent = result.owner
        buttonEl.value = result;
        buttonEl.append(completion, owner)

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

  removeActive(index) {
    this.element.children[index].classList.remove("active");
  }

  addActive(index) {
    this.element.children[index].classList.add("active");
  }
}
