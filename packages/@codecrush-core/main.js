import "./index.css";
import { Component, initEditor } from "./index";

const app = document.querySelector("#app");

class Example extends Component {
  onReady() {
    const activityBar = this.editor.getComponent("activity-bar");
    activityBar.registerActivity("new-character", "Keyboard: ", false);
  }
  onKeyPressed(key) {
    const activityBar = this.editor.getComponent("activity-bar");
    if (key == "a") {
      activityBar.updateActivity("new-character", "Keyboard: " + key, true);
    } else {
      activityBar.updateActivity("new-character", "Keyboard: " + key, false);
    }
  }
}

initEditor({
  theme: "poimandres",
  height: 400,
  id: "js-editor",
  parent: app,
  components: [Example],
});
