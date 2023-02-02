import { initEditor, EditorOptions } from "codecrush-core";
import { useEffect, useRef } from "react";

export type EditorProps = {} & Pick<
  EditorOptions,
  "height" | "id" | "theme" | "components"
>;

const Editor = (props: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      initEditor({
        theme: props.theme,
        height: props.height,
        id: props.id,
        parent: ref.current,
        components: props.components,
      });
    }
  }, [ref]);
  return <div style={{ width: "100%", height: props.height }} ref={ref}></div>;
};

export { Editor };
