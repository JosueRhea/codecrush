import "./index.css";
import { Component, initEditor } from "./index";

const app = document.querySelector("#app");

class Example extends Component {
  onKeyPressed(a) {
    console.log(a);
  }
}

initEditor({
  theme: "material-darker",
  height: 400,
  id: "js-editor",
  parent: app,
  components: [Example],
});

initEditor({
  theme: "poimandres",
  height: 400,
  id: "js-editor",
  parent: app,
});
