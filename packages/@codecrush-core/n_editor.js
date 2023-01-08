export class Editor {
  constructor() {
    this.components = [];
  }

  init(){
    window.addEventListener('keydown', () => {
      this.onUpdate()
    })
  }

  onUpdate() {
    for(const component of this.components){
      component.onUpdate()
    }
  }

  use(component) {
    this.components.push(component);
  }
}

export class Component extends Editor {
  constructor() {
    super();
  }

  onUpdate() {
    console.log("Update xdf")
  }
}
