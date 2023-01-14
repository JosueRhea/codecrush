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
    let words = string.split(/[\s.]+/);
    let currentPosition = 0;
    let wordPositions = [];
    words.forEach((word) => {
      let start = currentPosition;
      currentPosition += word.length + 1;
      let end = currentPosition - 1;
      wordPositions.push(start);
      wordPositions.push(end);
    });
    return wordPositions;
  }

  getBeforeWordPosition(array, position) {
    let beforeValue;
    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i] < position) {
        beforeValue = array[i];
        break;
      }
    }
    return beforeValue;
  }

  getAfterWordPosition(array, position) {
    let afterValue;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > position) {
        afterValue = array[i];
        break;
      }
    }
    return afterValue;
  }

  deleteCharacterRange(text, start, end) {
    console.log("given index", start, end)
    let newString = "";
    for (let i = 0; i < text.length; i++) {
      if (i >= start && i < end) {
        continue;
      } else {
        console.log("Enter here with index", start, end)
        newString += text[i];
      }
    }
    return newString
  }
}
