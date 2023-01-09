// import { Editor } from "./src/editor";
// import "./style.css"

// const editor = new Editor();

// editor.init();

import { Editor } from "./n_editor";
import { Navigation } from "./src/Navigation";
import { TextEditor } from "./src/TextEditor";
import "./style.css"

const editor = new Editor()
editor.use(new TextEditor)
editor.use(new Navigation)
editor.init()