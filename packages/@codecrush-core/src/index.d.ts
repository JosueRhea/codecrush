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
  components?: [T];
};

export declare class Editor {
  editorEl: HTMLDivElement;
  components: Component[];

  use(component: Component): void;
  getComponent<T>(componentId: ComponentId): T;
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

export type ComponentId =
  | "text-editor"
  | "navigation"
  | "autocompletion"
  | "selection";

export class NavigationComponent {
  onKeyPressed(key, withCtrlKey) {}

  onCharacterDelete() {}

  onNewLine() {}

  onDeleteLine(positionOnLine) {}

  moveRight() {}

  moveRightOneWord() {}

  moveLeft() {}

  moveUp(endOfLine = false) {}

  moveDown(startOfLine = false) {}

  movePageDown() {}

  movePageUp() {}

  moveEndOfLine() {}

  updateCursorPositionTo(position: number, line: any) {}

  updateScroll() {}

  //Mouse navigation
  onMouseClick(clickX: number, clickY: number) {}

  onCompletionAccept(completion: string) {}
}

export class TextEditorComponent {
  onKeyPressed(key: string) {}

  addCharacter(key: string) {}

  deleteCharacterInRange(lineIndex: number, start: number, end: number) {}

  deleteCharacterByLineIndex(lineIndex: number, position: number) {}

  deleteCharacter() {}

  createNewLine() {}

  deleteLine(currentLineIndex: number, position: number) {}

  recomputeLineNumbers() {}

  onCompletionAccept(completion: string) {}
}

export class SelectionComponent {
  isShiftKey = false;
  upCount = 0;
  downCount = 0;

  onKeyPressed() {}

  onPositionChange(data: PositionChange) {}

  selectTextToUp(
    lineBeforeIndex: number,
    positionBeforeIndex: number,
    lineAfterIndex: number,
    positionAfterIndex: number
  ) {}

  selectTextToDown(
    lineBeforeIndex: number,
    positionBeforeIndex: number,
    lineAfterIndex: number,
    positionAfterIndex: number
  ) {}

  selectTextToLeft(lineIndex: number, start: number, end: number) {}

  selectTextToRight(lineIndex: number, start: number, end: number) {}
  deselectText() {}

  deselectLine(lineIndex: number) {}

  renderSelection() {}
}

export type Suggestion = {
  suggestion: string;
  owner: string;
};

export class AutocompletionComponent {
  results: Suggestion[];
  currentWord: string;

  onKeyPressed(key: string) {}

  quit() {}

  async fetchAutoCompletions(currentWord) {}

  search() {}

  moveDown() {}

  moveUp() {}

  render() {}
}

export declare function initEditor(options: EditorOptions): Promise<Editor>;
export declare class Component extends Editor {
  editor: Editor;
  id: string;
  constructor(id: string) {}
  onKeyPressed(data: string, withCtrlKey: boolean, shiftKey: boolean) {}

  onCharacterDelete() {}

  onNewLine() {}

  onDeleteLine(positionOnLine: number) {}

  onLineIndexChange() {}

  onPositionChange(data: PositionChange) {}

  onMouseClick(clickX: number, clickY: number) {}

  onCompletionAccept(completion: string) {}
  onSearchSuggestions() {}
}
