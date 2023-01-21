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
};

export declare function initEditor(options: EditorOptions): Promise<void>;
