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
    this.originalWidth = 100;
    this.originalHeight = 100;
    this.imageNode.src = base64Img;
    this.image = new fabric.Image(this.imageNode);
    this.centerImage();
    console.log(this.counter);
    this.c.on("mouse:up", () => {
      this.addHistory();
    });

    // EVENTS
    this.addEvents();
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
    document.body
            .addEventListener("mouseup", () => {
            });
  }

  addHistory() {
  }

  add() {
    this.c.remove(this.image); // might be needed to prevent memory leaks?
    this.c.add(this.image);
  }

  resize(image) {
    if (image.width > this.imageMaxWidth || image.height > this.imageMaxHeight) {
      image.setHeight(50);
      image.setWidth(50);
      return image;
    }
    return image;
  }

  // ***********************
  // BUTTON CALLBACKS ******
  // ***********************

  centerImage() {
    console.log(this.image.left);
    this.image.left = (this.c.width / 2) - (this.image.width / 2);
    this.image.top = (this.c.height / 2) - (this.image.height / 2);
    this.add();
  }

  resetImage() {
    this.image.left = this.c.width / 2;
    this.image.top = this.c.height / 2;
    this.image.scaleToWidth(this.originalWidth);
    this.image.scaleToHeight(this.originalWidth);
    this.add();
  }

}
