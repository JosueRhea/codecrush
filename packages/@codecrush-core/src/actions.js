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

  addCharacter(value, lineContent, position) {
    return lineContent.slice(0, position) + value + lineContent.slice(position);
  }

  deleteAfter(lineContent, position) {
    return lineContent.slice(0, position);
  }

  getWordsPositions(string) {
    const positions = [];
    for (let i = 0; i < string.length; i++) {
      if (string[i] === " ") {
        positions.push(i);
      }
    }
    return positions;
  }

  getBeforeWordPosition(array, position) {
    let beforeValue;
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] < position) {
        beforeValue = array[i];
        break;
      }
    }
    return beforeValue
  }

  getAfterWordPosition(array, position){
    let afterValue;
    for (let i = 0; i < array.length; i++) {
      if (i > position) {
        afterValue = array[i];
        break;
      }
    }
    return afterValue
  }
}
