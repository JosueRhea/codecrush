import "./index.css";
import { Component, initEditor } from "./index";

const app = document.querySelector("#app");

class Example extends Component {}

initEditor({
  theme: "poimandres",
  height: 400,
  id: "js-editor",
  parent: app,
  components: [Example],
}).then((editor) => {
  const activityBar = editor.getComponent("activity-bar");
  activityBar.registerActivity("hi", "Hello world");
});
