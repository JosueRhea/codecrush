import "./App.css";
import { Editor } from "./components";
import "codecrush-core/dist/index.css";

function App() {
  return (
    <div className="grid">
      <div className="code-editor">
        <Editor height={300} id={"js-editor"} theme="material-darker" initialValue={`import { Component } from "codecrush-core";
  
class Example extends Component {
  constructor(){
    super('example')
  }
  onReady() {
    const activityBar = this.editor.getComponent("activity-bar");
    activityBar.registerActivity("new-character", "Keyboard: ", false);
  }
  onKeyPressed(key) {
    const activityBar = this.editor.getComponent("activity-bar");

    activityBar.updateActivity("new-character", "Keyboard: " + key, false);
  }
}`} />
      </div>
    </div>
  );
}

export default App;
