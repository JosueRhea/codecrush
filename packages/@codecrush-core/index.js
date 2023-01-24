import { AutoCompletion } from "./src/AutoCompletion";
import { Editor } from "./src/editor";
import { Navigation } from "./src/Navigation";
import { Selection } from "./src/Selection";
import { TextEditor } from "./src/TextEditor";
import "./style.css";

export { Component } from "./src/Component";

export async function initEditor(options) {
  const editor = new Editor(options);
  editor.use(new TextEditor());
  editor.use(new Navigation());
  editor.use(new AutoCompletion());
  editor.use(new Selection());
  await editor.init();
  return editor;
}
