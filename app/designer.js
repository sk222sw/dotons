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
    this.centerImage();
    this.originalWidth = this.image.width;
    this.originalHeight = this.image.height;
    this.addEvents();
    this.add();
    this.history = [];
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
    this.c.on("mouse:up", () => {
      this.addHistory();
    });
  }

  /**
   * add current image to history array
   * to allow undo/redo
   */
  addHistory() {
    const newImg = _.cloneDeep(this.image);
    newImg.setWidth(100);
    this.history.push(newImg);
    _.each(this.history, img => {
      console.log(img.width);
    });
    console.log(this.history);
  }

  /**
   * used to check if the image changed when mouse was released
   */
  imageChanged() {}

  /**
   * call this function after making changes to the image object.
   * for example centering or resetting
   */
  add() {
    console.log("hej");
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
}