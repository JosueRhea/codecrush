import { Button } from "ui";
// import { initEditor } from "@codecrush-core";
import { initEditor } from "@codecrush/core";
import { useEffect } from "react";

export default function Web() {
  useEffect(() => {
    console.log(initEditor());
  }, []);
  return (
    <div>
      <h1>Web</h1>
      <Button />
    </div>
  );
}
