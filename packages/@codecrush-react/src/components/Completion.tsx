import { Component } from "codecrush-core";

export class CohereAutoCompletion extends Component {
  constructor() {
    super();
  }

  onKeyPressed(data: string, withCtrlKey: boolean, shiftKey: boolean): void {
    console.log(data);
  }
}
