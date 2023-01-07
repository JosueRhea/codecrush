export class Actions {
  deleteCharacter(lineContent, position) {
    let newContent = "";
    for (let i = 0; i < lineContent.length; i++) {
      if (i != position - 1) {
        newContent += lineContent[i];
      }
    }
    return newContent;
  }

  addCharacter(value, lineContent, position){    
    return lineContent.slice(0, position) + value + lineContent.slice(position);
  }
}
