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
    this.#textEl = p;
    this.#lineEl = div;
    this.actions = new Actions();
  }

  destroy(){
    this.#lineEl.remove()
  }

  appendText(newText) {
    this.#textEl.textContent += newText;
  }

  deleteCharacter() {
    this.#textEl.textContent = this.actions.deleteCharacter(
      this.#textEl.textContent
    );
  }

  isEmpty(){
    return this.#textEl.textContent == ""
  }
}
