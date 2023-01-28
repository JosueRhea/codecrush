import { Component } from "./Component";

export class Shortcuts extends Component {
  constructor() {
    super("shortcuts");
    this.shortcuts = [];
  }

  onReady() {
    console.log("Editor ready for shortcuts");
  }

  onKeyPressed(key, withCtrlKey, shiftKey) {
    this.shortcuts.forEach((action) => {
      if (
        action.withCtrl &&
        withCtrlKey &&
        action.withShift &&
        shiftKey &&
        action.key.toUpperCase() === key
      ) {
        this.editor.preventDefault(this.id);
        action.cb();
      }

      if (
        !action.withCtrl &&
        !withCtrlKey &&
        action.withShift &&
        shiftKey &&
        action.key.toUpperCase() === key
      ) {
        this.editor.preventDefault(this.id);
        action.cb();
      }

      if (
        action.withCtrl &&
        withCtrlKey &&
        !action.withShift &&
        !shiftKey &&
        action.key === key
      ) {
        this.editor.preventDefault(this.id);
        action.cb();
      }
    });
  }

  register({ withCtrl, withShift, key }, cb) {
    if (!withCtrl && !withShift)
      throw new Error("Please provide at least one, withCtrl or withShift");
    if (!key) throw new Error("Please provide a key");
    if (!cb) throw new Error("Please provide a callback function");
    this.shortcuts.push({ withCtrl, withShift, key, cb });
  }
}
