export class Actions {
  deleteCharacter(lineContent) {
    return lineContent.slice(0, -1);
  }
}
