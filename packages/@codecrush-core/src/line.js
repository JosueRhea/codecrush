import { Actions } from "./actions";
import { sumArrayUntilIndex } from "./utils/array";

export class Line {
  #textEl = null;
  #lineEl = null;
  #lineNumberEl = null;
  constructor(codeEl, content, lineNumber, index) {    
    this.actions = new Actions();
    this.leftMovesOffsets = [];
    const div = document.createElement("div");
    const lineNumberEl = document.createElement("div");
    lineNumberEl.classList.add("line-number");
    lineNumberEl.textContent = lineNumber;
    div.classList.add("line");
    const p = document.createElement("p");
    this.#textEl = p;
    p.classList.add("line-content");
    div.appendChild(p);
    codeEl.insertBefore(div, codeEl.children[index]);
    lineNumberEl.style.height = div.getBoundingClientRect().height + "px";
    this.#lineNumberEl = lineNumberEl;
    // Properties
    this.#textEl = p;
    this.#lineEl = div;
    this.isActive = false;
    if (content != "") {
      this.appendText(content, 0);
    }
  }

  destroy() {
    this.#lineEl.remove();
    this.#lineNumberEl.remove();
  }

  changeLineNumber(number) {    
    this.#lineNumberEl.textContent = number;
  }

  appendText(newText, currentCursorPosition) {
    this.#lineEl.id = newText 
    if (newText.length > 1) {
      let newCursor = currentCursorPosition;
      for (let i = 0; i < newText.length; i++) {
        const beforePosition = this.#textEl.offsetWidth;
        this.#textEl.textContent = this.actions.addCharacter(
          newText[i],
          this.#textEl.textContent,
          newCursor
        );
        newCursor++;
        this.leftMovesOffsets.push(this.#textEl.offsetWidth - beforePosition);
      }
    } else {
      const beforePosition = this.#textEl.offsetWidth;
      this.#textEl.textContent = this.actions.addCharacter(
        newText,
        this.#textEl.textContent,
        currentCursorPosition
      );
      this.leftMovesOffsets.push(this.#textEl.offsetWidth - beforePosition);
    }
  }

  deleteCharacter(currentCursorPosition) {
    this.#textEl.textContent = this.actions.deleteCharacter(
      this.#textEl.textContent,
      currentCursorPosition
    );
  }

  deleteCharacterAfter(position) {
    this.#textEl.textContent = this.actions.deleteAfter(
      this.#textEl.textContent,
      position
    );
  }

  giveContentTo(lineToAppend) {
    lineToAppend.appendText(this.getContent(), lineToAppend.getLength());
  }

  getContent() {
    return this.#textEl.textContent;
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

  setLineNumber(node, position) {
    node.insertBefore(this.#lineNumberEl, node.children[position]);
  }

  getContentAfter(position) {
    const content = this.#textEl.textContent.slice(
      position,
      this.#textEl.length
    );
    return content == "" ? null : content;
  }

  getPosition() {
    return { top: this.#textEl.offsetTop, left: this.#textEl.offsetLeft };
  }

  getHeight() {
    return this.#textEl.offsetHeight;
  }

  getClientHeight(){
    return this.#textEl.getBoundingClientRect().height;
  }

  getTextWidth() {
    return this.#textEl.getBoundingClientRect().width;
  }

  getLength() {
    return this.#textEl.textContent.length;
  }

  getOffsetSum(position) {
    return sumArrayUntilIndex(this.leftMovesOffsets, position);
  }
}
