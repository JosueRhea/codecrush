export class Cursor {
  constructor(editor, position) {
    this.pos = position ? position : 0;

    this.cursor = document.createElement("div")

    this.cursor.classList.add('cursor')    

    editor.appendChild(this.cursor)
  }
}
