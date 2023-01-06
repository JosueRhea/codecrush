import { Actions } from "./actions";

export class Line {
  #textEl = null;
  #lineEl = null;
  constructor(codeEl, content) {
    const div = document.createElement("div");
    div.classList.add("line");
    const p = document.createElement("p");
    p.classList.add("line-content");
    p.textContent = content;
    div.appendChild(p);
    codeEl.appendChild(div);

    // Properties
    this.#textEl = p;
    this.#lineEl = div;
    this.actions = new Actions();
    this.isActive = false;

    this.leftMovesOffsets = []
  }

  destroy() {
    this.#lineEl.remove();
  }

  appendText(newText) {
    const beforePosition = this.#textEl.offsetWidth
    this.#textEl.textContent += newText;
    this.leftMovesOffsets.push(this.#textEl.offsetWidth - beforePosition)
  }

  deleteCharacter() {
    this.#textEl.textContent = this.actions.deleteCharacter(
      this.#textEl.textContent
    );
  }

  isEmpty() {
    return this.#textEl.textContent == "";
  }

  setIsActive(isActive) {
    this.isActive = isActive;
    if (isActive) {
      this.#lineEl.classList.add("active");
    } else {
      this.#lineEl.classList.remove("active");
    }
  }

  getPosition(){
    return {top: this.#lineEl.offsetTop, left: this.#lineEl.offsetLeft}
  }

  getHeight(){
    return this.#lineEl.offsetHeight 
  }

  getTextWidth(){
    return this.#textEl.getBoundingClientRect().width
  }
  
  getLength(){
    return this.#textEl.textContent.length
  }
}
