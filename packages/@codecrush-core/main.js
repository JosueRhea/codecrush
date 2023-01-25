import "./index.css";
import { initEditor } from "./index";

const app = document.querySelector("#app");

initEditor({
  theme: "poimandres",
  height: 400,
  id: "js-editor",
  parent: app,
}).then((editor) => {
  const activityBar = editor.getComponent("activity-bar");
  activityBar.registerActivity("hi", 'Hello world', true)
});
