import "./index.css";
import { initEditor } from "./index";

const app = document.querySelector("#app");

initEditor({
  theme: "material-darker",
  height: 400,
  id: "js-editor",
  parent: app,
  cohereToken: import.meta.env.VITE_COHERE_TOKEN,
});

initEditor({
  theme: "poimandres",
  height: 400,
  id: "js-editor",
  parent: app,
  cohereToken: import.meta.env.VITE_COHERE_TOKEN,
});
