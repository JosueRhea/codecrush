import { AutoCompletion } from "./src/AutoCompletion";
import { Editor } from "./src/editor";
import { Navigation } from "./src/Navigation";
import { Selection } from "./src/Selection";
import { TextEditor } from "./src/TextEditor";
import "./style.css";

export async function initEditor(options) {
  const editor = new Editor(options.theme);
  editor.use(new TextEditor());
  editor.use(new Navigation());
  editor.use(new Selection());
  editor.use(new AutoCompletion());
  await editor.init();
  return editor;
}
