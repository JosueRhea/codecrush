import { Editor } from "codecrush-react";

export default function Web() {
  return (
    <div>
      <Editor
        height={500}
        id="js-editor"
        theme="material-ocean"
      />
    </div>
  );
}
