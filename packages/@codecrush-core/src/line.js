export class Line {
  constructor(codeEl, content) {
    const p = document.createElement('p')
    p.classList.add('line')
    p.innerHTML = content
    codeEl.appendChild(p)
  }
}
