export class Cursor {
  constructor(editor, position, height, color) {
    this.pos = { top: position.top, left: position.left };

    this.cursor = document.createElement("div");
    this.cursor.style.backgroundColor = color
    this.cursor.style.position = "absolute";
    this.cursor.style.top = this.pos.top + "px";
    this.cursor.style.left = this.pos.left + "px";
    this.cursor.style.height = height + "px";
    this.cursor.classList.add("cursor");

    editor.appendChild(this.cursor);
  }

  updatePosition({ top, left }) {
    this.cursor.style.top = top + "px";
    this.cursor.style.left = left + "px";
  }

  getPosition(){
    return this.cursor.getBoundingClientRect()
  }

  getLeft(){
    return this.cursor.offsetLeft
  }

  moveLeftOneCharacter(offset) {    
    this.cursor.style.left = `${this.cursor.offsetLeft - offset}px`;
  }

  moveRightOneCharacter(offset) {
    this.cursor.style.left = `${this.cursor.offsetLeft + offset}px`;
  }
}
