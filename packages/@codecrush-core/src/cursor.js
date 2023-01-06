export class Cursor {
  constructor(editor, position, height) {
    this.pos = { top: position.top, left: position.left };

    this.cursor = document.createElement("div");
    this.cursor.style.position = "absolute";
    this.cursor.style.top = this.pos.top + "px";
    this.cursor.style.left = this.pos.left + "px";
    this.cursor.style.height = height + "px";
    this.cursor.classList.add("cursor");

    editor.appendChild(this.cursor);
    this.lastLeftIncrement = 0;
  }

  updatePosition({ top, left }) {
    const currentPosition = this.cursor.offsetLeft;
    this.cursor.style.top = top + "px";
    this.cursor.style.left = left + "px";
    this.lastLeftIncrement = this.cursor.offsetLeft - currentPosition;
  }

  moveLeftOneCharacter(offset) {
    this.cursor.style.left = `${this.cursor.offsetLeft - offset}px`;
  }

  moveRightOneCharacter(offset) {
    this.cursor.style.left = `${this.cursor.offsetLeft + offset}px`;
  }
}
