export class Cursor {
  constructor(editor, position, height, color) {
    this.pos = { top: position.top, left: position.left };

    this.cursor = document.createElement("div");
    this.cursor.style.backgroundColor = color;
    this.cursor.style.position = "absolute";
    this.cursor.style.top = this.pos.top + "px";
    this.cursor.style.left = this.pos.left + "px";
    this.cursor.style.height = height + "px";
    this.cursor.classList.add("cursor");

    editor.appendChild(this.cursor);
    this.deactivate()
  }

  disableAnimation() {
    if (this.cursor.style.animation) {
      this.cursor.style.animation = "";
    }
  }

  activate() {
    if (!this.cursor.style.animation) {
      this.cursor.style.animation = "cursor-blink 1.5s steps(2) infinite";
    }

    this.cursor.style.opacity = 1;
  }

  deactivate() {
    if (this.cursor.style.animation) {
      this.cursor.style.animation = "";
    }
    this.cursor.style.opacity = 0;
  }

  enableAnimation() {
    if (!this.cursor.style.animation) {
      this.cursor.style.animation = "cursor-blink 1.5s steps(2) infinite";
    }
  }

  updatePosition({ top, left }) {
    this.cursor.style.top = top + "px";
    this.cursor.style.left = left + "px";
  }

  getPosition() {
    return this.cursor.getBoundingClientRect();
  }

  getLeft() {
    return this.cursor.offsetLeft;
  }

  moveLeftOneCharacter(offset) {
    this.cursor.style.left = `${this.cursor.offsetLeft - offset}px`;
  }

  moveRightOneCharacter(offset) {
    this.cursor.style.left = `${this.cursor.offsetLeft + offset}px`;
  }
}
