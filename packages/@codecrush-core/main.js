import { Editor } from "./src/editor";
import { Navigation } from "./src/Navigation";
import { Selection } from "./src/Selection";
import { TextEditor } from "./src/TextEditor";
import "./style.css"

const editor = new Editor()
editor.use(new TextEditor)
editor.use(new Navigation)
editor.use(new Selection)
editor.init()

// const range = document.createRange();

// const p1 = document.querySelector(".p1");
// const p2 = document.querySelector(".p2");
// const parent = document.querySelector("#app");

// document.addEventListener("click", () => {
//   const range = document.createRange();
//   range.setStart(p1.firstChild, 0);
//   range.setEnd(p2.firstChild, 4);
//   const selection = window.getSelection();
//   selection.removeAllRanges();
//   selection.addRange(range);
// });
