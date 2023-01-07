import { Actions } from "./actions";
import { sumArrayUntilIndex } from "./utils/array";

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
    if (newText.length > 1) {
      console.log("Enter more");
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
      console.log("Enter");
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

  getOffsetSum(position) {
    return sumArrayUntilIndex(this.leftMovesOffsets, position);
  }
}
