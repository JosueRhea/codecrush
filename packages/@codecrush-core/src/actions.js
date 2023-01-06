export class Actions {

    deleteCharacter(editorContent) {
        return editorContent.slice(0, -1)
    }
}