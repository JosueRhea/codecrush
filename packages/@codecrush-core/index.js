import { ActivityBar } from "./src/ActivityBar";
import { AutoCompletion } from "./src/AutoCompletion";
import { Editor } from "./src/editor";
import { HistoryChanges } from "./src/HistoryChanges";
import { Navigation } from "./src/Navigation";
import { Selection } from "./src/Selection";
import { Shortcuts } from "./src/Shortcuts";
import { TextEditor } from "./src/TextEditor";
import "./style.css";

export { Component } from "./src/Component";

export async function initEditor(options) {
  const editor = new Editor(options);
  editor.use(new TextEditor());
  editor.use(new Navigation());
  editor.use(new AutoCompletion());
  editor.use(new Selection());
  editor.use(new ActivityBar());
  editor.use(new Shortcuts());
  editor.use(new HistoryChanges());
  if (options.components && options.components.length > 0) {
    options.components.forEach((cmp) => {
      editor.use(new cmp());
    });
  }
  await editor.init();
  return editor;
}
