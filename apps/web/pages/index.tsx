import { Editor } from "codecrush-react";

export default function Web() {
  return (
    <div>
      <Editor height={300} id="js-editor" theme="one-dark-pro" />
      <Editor height={300} id="one-editor" theme="material-darker" />
    </div>
  );
}
