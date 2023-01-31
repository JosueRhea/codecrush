import { Actions } from "./actions";
import { sumArrayUntilIndex, sumRange } from "./utils/array";

export class Line {
  #lineEl = null;
  #lineNumberEl = null;
  constructor(codeEl, content, lineNumber, index) {
    this.textEl = null;
    this.actions = new Actions();
    this.leftMovesOffsets = [];
    this.lineHtml = "";
    this.text = "";
    this.positions = [];
    this.selection = null;
    this.selectionEl = null;
    this.init(codeEl, content, lineNumber, index);
  }

  init(codeEl, content, lineNumber, index) {
    const div = document.createElement("div");
    const lineNumberEl = document.createElement("div");
    lineNumberEl.classList.add("line-number");
    lineNumberEl.textContent = lineNumber;
    div.classList.add("line");
    const p = document.createElement("p");
    this.textEl = p;
    p.classList.add("line-content");
    div.appendChild(p);
    codeEl.insertBefore(div, codeEl.children[index]);
    lineNumberEl.style.height = div.getBoundingClientRect().height + "px";
    this.#lineNumberEl = lineNumberEl;

    //selection
    const selectionDiv = document.createElement("div");
    selectionDiv.classList.add("selection");
    div.appendChild(selectionDiv);
    this.selectionEl = selectionDiv;
    // Properties
    this.textEl = p;
    this.#lineEl = div;
    this.isActive = false;
  }

  getBeforeWordPosition(position) {
    return this.actions.getBeforeWordPosition(this.positions, position);
  }

  getAfterWordPosition(position) {
    return this.actions.getAfterWordPosition(this.positions, position);
  }

  destroy() {
    this.#lineEl.remove();
    this.#lineNumberEl.remove();
  }

  changeLineNumber(number) {
    this.#lineNumberEl.textContent = number;
  }

  getLineNumber() {
    return this.#lineNumberEl.textContent;
  }

  appendText(newText, currentCursorPosition, highlighter) {
    if (newText.length > 1) {
      let newCursor = currentCursorPosition;
      for (let i = 0; i < newText.length; i++) {
        const beforePosition = this.textEl.offsetWidth;
        const textParsed = this.actions.addCharacter(
          newText[i],
          this.textEl.textContent,
          newCursor
        );
        this.text = textParsed;
        this.getHtml(highlighter);
        newCursor++;
        this.leftMovesOffsets.push(this.textEl.offsetWidth - beforePosition);
      }
    } else {
      const beforePosition = this.textEl.offsetWidth;
      const textParsed = this.actions.addCharacter(
        newText,
        this.textEl.textContent,
        currentCursorPosition
      );
      this.text = textParsed;
      this.getHtml(highlighter, currentCursorPosition);
      this.leftMovesOffsets.push(this.textEl.offsetWidth - beforePosition);
    }
    this.positions = this.actions.getWordsPositions(this.text);
  }

  getHtml(highlighter, currentCursorPosition) {
    if (!highlighter) return;
    const highlightedTokens = highlighter(this.text);
    this.textEl.innerHTML = "";
    highlightedTokens[0].forEach((token) => {
      const element = this.createTokenElement(token);
      this.textEl.appendChild(element);
    });
  }

  createTokenElement(token) {
    const span = document.createElement("span");
    span.innerText = token.content;
    span.style.color = token.color;
    span.style.fontStyle = token.fontStyle;
    return span;
  }

  deleteCharacter(currentCursorPosition, highlighter) {
    const textParsed = this.actions.deleteCharacter(
      this.textEl.textContent,
      currentCursorPosition
    );
    this.text = textParsed;
    this.getHtml(highlighter, currentCursorPosition);
    this.leftMovesOffsets.length = this.getLength();
  }

  deleteCharacterAfter(position, highlighter) {
    const textParsed = this.actions.deleteAfter(
      this.textEl.textContent,
      position
    );
    this.text = textParsed;
    this.getHtml(highlighter, position);
    this.leftMovesOffsets.length = this.getLength();
  }

  deleteCharacterRange(start, end, highlighter) {
    const textParsed = this.actions.deleteCharacterRange(
      this.textEl.textContent,
      start,
      end
    );
    this.text = textParsed;
    this.getHtml(highlighter, start);
    this.leftMovesOffsets.length = this.getLength();
  }

  giveContentTo(lineToAppend, highlighter) {
    lineToAppend.appendText(
      this.getContent(),
      lineToAppend.getLength(),
      highlighter
    );
  }

  getContent() {
    return this.textEl.textContent;
  }

  isEmpty() {
    return this.textEl.textContent == "";
  }

  setIsActive(isActive) {
    this.isActive = isActive;
    if (isActive) {
      this.#lineEl.classList.add("active");
      this.#lineNumberEl.classList.add("active");
    } else {
      this.#lineEl.classList.remove("active");
      this.#lineNumberEl.classList.remove("active");
    }
  }

  setLineNumber(node, position) {
    node.insertBefore(this.#lineNumberEl, node.children[position]);
  }

  getContentAfter(position) {
    const content = this.textEl.textContent.slice(position, this.textEl.length);
    return content == "" ? null : content;
  }

  getPosition() {
    return { top: this.textEl.offsetTop, left: this.textEl.offsetLeft };
  }

  getHeight() {
    return this.textEl.offsetHeight;
  }

  getClientHeight() {
    return this.textEl.getBoundingClientRect().height;
  }

  getTextWidth() {
    return this.textEl.getBoundingClientRect().width;
  }

  getLength() {
    return this.textEl.textContent.length;
  }

  getOffsetSum(position) {
    return sumArrayUntilIndex(this.leftMovesOffsets, position);
  }

  getOffsetSumRange(start, end) {
    return sumRange(this.leftMovesOffsets, start, end);
  }

  getClosestPositionIndex(target) {
    let currentSum = 0;
    for (let i = 0; i < this.leftMovesOffsets.length; i++) {
      currentSum += this.leftMovesOffsets[i];
      if (currentSum >= target) {
        return i;
      }
    }
    return this.leftMovesOffsets.length;
  }

  clone() {
    return {
      content: this.getContent(),
      index: Number(this.getLineNumber()),
    };
  }
}
