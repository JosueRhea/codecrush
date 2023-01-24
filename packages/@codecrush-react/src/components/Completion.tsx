import { Component } from "codecrush-core";

export class CohereAutoCompletion extends Component {
  constructor() {
    super('cohere-autocompletion');
  }

  onKeyPressed(data: string, withCtrlKey: boolean, shiftKey: boolean): void {
    // const autoCompletion = this.editor
    console.log(this.editor);
  }
}
