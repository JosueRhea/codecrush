import { Actions } from "./actions";

export class Line {
  #textEl = null;
  #lineEl = null;
  #lineNumberEl = null;
  constructor(codeEl, content, lineNumber) {
    const div = document.createElement("div");
    const lineNumberEl = document.createElement("div");
    lineNumberEl.classList.add("line-number");
    lineNumberEl.textContent = lineNumber;
    div.classList.add("line");
    const p = document.createElement("p");
    p.classList.add("line-content");
    p.textContent = content;
    div.appendChild(p);
    codeEl.appendChild(div);
    lineNumberEl.style.height = div.getBoundingClientRect().height + "px";
    this.#lineNumberEl = lineNumberEl;
    // Properties
    this.#textEl = p;
    this.#lineEl = div;
    this.actions = new Actions();
    this.isActive = false;

    this.leftMovesOffsets = [];
  }

  destroy() {
    this.#lineEl.remove();
    this.#lineNumberEl.remove();
  }

  appendText(newText, currentCursorPosition) {
    const beforePosition = this.#textEl.offsetWidth;
    this.#textEl.textContent = this.actions.addCharacter(newText, this.#textEl.textContent, currentCursorPosition);
    this.leftMovesOffsets.push(this.#textEl.offsetWidth - beforePosition);
  }

  deleteCharacter(currentCursorPosition) {
    this.#textEl.textContent = this.actions.deleteCharacter(
      this.#textEl.textContent,
      currentCursorPosition
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

  setLineNumber(node) {
    node.appendChild(this.#lineNumberEl);
  }

  getPosition() {
    return { top: this.#textEl.offsetTop, left: this.#textEl.offsetLeft };
  }

  getHeight() {
    return this.#textEl.offsetHeight;
  }

  getTextWidth() {
    return this.#textEl.getBoundingClientRect().width;
  }

  getLength() {
    return this.#textEl.textContent.length;
  }
}
