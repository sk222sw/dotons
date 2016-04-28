/* global fabric */

import _ from "lodash";

export default class Designer {
  constructor(base64Img) {
    this.c = new fabric.Canvas("canvas");
    this.imageNode = document.createElement("img");
    this.imageMaxHeight = 500;
    this.imageMaxWidth = 700;
    this.c.setHeight(500);
    this.c.setWidth(700);
    this.imageNode.src = base64Img;
    this.image = new fabric.Image(this.imageNode);
    this.history = [];
    this.undoIndex = 0;
    this.centerImage();
    this.originalWidth = this.image.width;
    this.originalHeight = this.image.height;
    this.addEvents();
    this.add();
    this.history.push(this.image);
  }

  addEvents() {
    document.getElementById("center-image")
      .addEventListener("click", () => {
        this.centerImage();
      });
    document.getElementById("reset-image")
      .addEventListener("click", () => {
        this.resetImage();
      });
    document.getElementById("undo")
      .addEventListener("click", () => {
        this.undo();
      });
    document.getElementById("redo")
      .addEventListener("click", () => {
        this.redo();
      });
    this.c.on("object:modified", () => {
      this.addHistory();
      this.writeState();
    });
  }

  /**
   * add current image to history array
   * to allow undo/redo
   */
  addHistory() {
    // TODO warning: there is separate addHistory logic
    // in the centerImage method
    if (this.undoIndex < this.history.length) {
      this.history = this.history.slice(0, this.undoIndex);
    }
    const img = _.cloneDeep(this.c.getActiveObject());
    this.history.push(img);
    this.undoIndex = this.history.length;
  }

  /**
   *
   */
  undo() {
    if (this.undoIndex !== 0) {
      this.undoIndex--;
    }
    this.c.remove(this.image); // DRY but needed or fabric will add a new copy to the canvas :S:S:S
    if (this.undoIndex === 0) {
      console.log(this.history[0])
      this.c.centerObject(this.image);
    } else {
      this.image = this.history[this.undoIndex-1];
    }
    this.add();
    this.writeState();
  }
  
  /**
   * 
   */
  redo() {
    if (this.undoIndex < this.history.length) {
      this.undoIndex++;
      this.c.remove(this.image); // DRY but needed or fabric will add a new copy to the canvas :S:S:S
      this.image = _.cloneDeep(this.history[this.undoIndex - 1]);
      this.add();
    }
    
    this.writeState();
  }

  /**
   * call this function after making changes to the image object.
   * for example centering or resetting
   */
  add() {
    this.c.remove(this.image); // might be needed to prevent memory leaks?
    this.c.add(this.image);
  }

  /**
   * resize image object if it's too big
   * @returns resized version of image
   */
  resize(image) {
    if (image.width > this.imageMaxWidth || image.height > this.imageMaxHeight) {
      image.setHeight(50);
      image.setWidth(50);
      return image;
    }
    return image;
  }

  /**
   * center image object.
   * call add() afterwards to make the changes visible
   */
  centerImage() {
    this.c.centerObject(this.image);
    this.history.push(this.image);
    this.undoIndex = this.history.length;
    this.add();
    this.writeState();
  }

  /**
   * center image object and reset original dimensions
   * call add() afterwards to make the changes visible
   */
  resetImage() {
    this.centerImage();
    this.image.scaleToWidth(this.originalWidth);
    this.image.scaleToHeight(this.originalWidth);
  }
  
  writeState() {
    const state = document.querySelector("#state");
    state.innerHTML = "";
    state.innerHTML =
    "<div>"
      + "<h3>state</h3>"
      + "<div>"
        + "index: " + this.undoIndex
      + "</div>"
      + "<div>"
        + "historyLength: " + this.history.length
      + "</div>"
    + "</div>";    
  }
}