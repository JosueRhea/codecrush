# Codecrush React
An wrapper for codecrush-core to use the editor in react

## Installation

Choose your favorite package manager

```cmd
pnpm install codecrush-core codecrush-react
```

```cmd
npm install codecrush-core codecrush-react
```

```cmd
yarn add codecrush-core codecrush-react
```

## Getting started

```tsx
import { Editor } from "codecrush-react";
import "codecrush-core/dist/index.css"; // styles from the core package

function App() {
  return (
    <div className="App">
      <Editor height={400} id="js-editor" theme="material-darker" />
    </div>
  );
}

export default App;
```

## Themes
List of all themes included
```ts
export type EditorThemes =
  | "dracula-soft"
  | "material-darker"
  | "material-default"
  | "material-ocean"
  | "material-palenight"
  | "nord"
  | "one-dark-pro"
  | "poimandres"
  | "rose-pine-moon"
  | "rose-pine"
  | "slack-dark";
```

## Extending the editor
You can create custom components for the editor. 
The following example we create a component to register in the activity bar which key is pressed.

In this case we'll be using `onReady` and `onKeyPressed` events provided by the editor.
```jsx
import { Editor } from "codecrush-react";
import "codecrush-core/dist/index.css"; // styles from the core package
import { Component, ActivityBarComponent } from "codecrush-core";

class Example extends Component {
  onReady() {
    const activityBar = this.editor.getComponent<ActivityBarComponent>("activity-bar"); // get the activity bar
    activityBar.registerActivity("key-pressed", "Keyboard: "); // register a new entry with id and text
  }

  onKeyPressed(key: string) {
    const activityBar = this.editor.getComponent<ActivityBarComponent>("activity-bar");
    activityBar.updateActivity("key-pressed", "Keyboard: " + key); //update the activity when the key is pressed
  }
}

function App() {
  return (
    <div className="App">
      <Editor
        height={400}
        id="js-editor"
        theme="material-darker"
        components={[Example]}
      />
    </div>
  );
}

export default App;
```