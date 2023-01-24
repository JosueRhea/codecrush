import "./App.css";
import { Editor } from "./components";
import { CohereAutoCompletion } from "./components/Completion";
import "codecrush-core/dist/index.css";

function App() {
  return (
    <div className="grid">
      <div className="code-editor">
        <Editor
          height={300}
          id={"js-editor"}
          theme="material-darker"
          components={[CohereAutoCompletion]}
        />
      </div>
      {/* <div className="code-editor">
        <Editor height={300} id={"another-editor"} theme="dracula-soft" />
      </div> */}
    </div>
  );
}

export default App;
