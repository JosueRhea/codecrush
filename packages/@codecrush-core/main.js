import "./index.css";
import { initEditor } from "./index";

const app = document.querySelector("#app");
console.log(app)

initEditor({
  theme: "poimandres",
  height: 400,
  id: "js-editor",
  parent: app,
});

initEditor({
  theme: "poimandres",
  height: 400,
  id: "hola-editor",
  parent: app,
});
