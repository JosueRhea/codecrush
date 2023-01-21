import { initEditor } from "codecrush-core";
import { useEffect } from "react";
import "codecrush-core/dist/index.css";

const Editor = () => {
  useEffect(() => {
    initEditor({ theme: "material-darker", height: 300, id: "hello-world" });
  }, []);
  return <div className="codecrush-editor"></div>;
};

export default Editor;
