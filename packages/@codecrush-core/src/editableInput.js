export class EditableInput {
  #el = null;
  constructor() {
    const textarea = document.createElement("textarea");
    textarea.style.position = "absolute";
    textarea.style.opacity = 0;
    textarea.style.top = 0;
    textarea.style.width = 0;
    textarea.style.height = 0;
    document.body.appendChild(textarea);
    this.#el = textarea;
  }
  focus() {
    this.#el.focus();
  }

  getValue() {
    return this.#el.value;
  }

  onChange(cb) {
    this.#el.addEventListener("keydown", (e) => {
      e.preventDefault()
      cb(e.key);
    });
  }

  onBlur(cb) {
    this.#el.addEventListener("blur", cb);
  }
}
