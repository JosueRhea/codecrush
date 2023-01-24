export type EditorTheme =
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

export type EditorOptions = {
  theme: EditorTheme;
  height: number;
  id: string;
  parent: Element;
  cohereToken?: string;
};

export declare class Editor {
  editorEl: HTMLDivElement;

  use(component: Component): void;
}

export type PositionChange = {
  before: {
    index: number;
    position: number;
  };
  after: {
    index: number;
    position: number;
  };
};

export declare function initEditor(options: EditorOptions): Promise<Editor>;
export declare class Component extends Editor {
  onKeyPressed(data: string, withCtrlKey: boolean, shiftKey: boolean) {}

  onCharacterDelete() {}

  onNewLine() {}

  onDeleteLine(positionOnLine: number) {}

  onLineIndexChange() {}

  onPositionChange(data: PositionChange) {}

  onMouseClick(clickX: number, clickY: number) {}

  onCompletionAccept(completion: string) {}
}
