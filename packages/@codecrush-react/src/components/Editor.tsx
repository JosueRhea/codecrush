import { initEditor, EditorOptions } from "codecrush-core";
import { useEffect, useRef } from "react";

export type EditorProps = {} & Pick<EditorOptions, "height" | "id" | "theme">;

const Editor = (props: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // if (!ref)
    //   throw new Error("Please provide a ref to a container for the editor");
    if (ref.current) {
      initEditor({
        theme: props.theme,
        height: props.height,
        id: props.id,
        parent: ref.current,
      });
    }
  }, []);
  return <div style={{ width: "100%" }} ref={ref}></div>;
};

export { Editor };
