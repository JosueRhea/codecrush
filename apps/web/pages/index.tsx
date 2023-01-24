import { Editor } from "codecrush-react";
import { CohereAutoCompletion } from "../editorPlugins/AiAutocompletion";

export default function Web() {
  return (
    <div>
      <Editor
        height={300}
        id="js-editor"
        theme="material-darker"
        components={[CohereAutoCompletion]}
      />
    </div>
  );
}
