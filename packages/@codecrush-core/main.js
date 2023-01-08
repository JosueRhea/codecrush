// import { Editor } from "./src/editor";
// import "./style.css"

// const editor = new Editor();

// editor.init();

import { Editor, Component } from "./n_editor";

const editor = new Editor()
editor.use(new Component)
editor.init()