/* global fabric */

import _ from "lodash";

/**
 * The designer class, responsible of image maniplation
 * and cropping
 */
export default class Designer {
  /**
   * Instantiates a new instance of the Designer class
   */
  constructor() {
    const parentNode = document.getElementById("canvas-area");
    const parentWidth = parentNode.clientWidth;
    const parentHeight = parentNode.clientHeight;

    // create fabric canvas
    this.c = new fabric.Canvas("canvas");

    this.c.setWidth(parentWidth);
    this.c.setHeight(parentHeight);

    console.log("parentHeight", parentHeight);

    // max dimensions
    this.imageMaxHeight = this.c.height;
    this.imageMaxWidth = this.c.width;

    const bigOverlayImagePath = "/images/overlay_big.png";
    const smallOverlayImagePath = "/images/overlay_small2.png";

    const overlayImage = parentWidth > 500 ? bigOverlayImagePath : smallOverlayImagePath;

    // New code, solves bug of not rendering circle until canvas has been clicked..
    this.circle = fabric.Image.fromURL(overlayImage, image => {
      image.set({
        opacity: 0.82,
        width: this.c.width,
        height: this.c.height,
        selectable: false
      });
      image = this.resize(image);
      this.c.setOverlayImage(image);
      this.c.add(image);
      this.c.renderAll();
    });
  }
  
  /**
   * Initiates the designer
   * 
   * @param {string} img - Base64 string representation of an image
   */
  init(image) {
    // create image node
    this.imageNode = document.createElement("img");
    this.imageNode.src = image;

    // // put image node in fabric
    // this.image = new fabric.Image(this.imageNode);


    // // used for undo/redo
    this.history = [];
    this.undoIndex = 0;

    // // initial stuff
    // this.addEvents();
    // this.image = this.resize(this.image);
    // this.centerImage();
    // this.add();
    // this.history.push(this.image);
    console.log("In designer.init()");
    if (this.image) {
      console.log("hehe");

      this.image.remove();
      this.image = null;
      this.c.remove(this.c.getObjects()[0]);
      this.c.renderAll();
    }

    fabric.Image.fromURL(image, img => {
      console.log("In Image.fromURL");
      img.globalComositeOperation = "source-atop";
      this.image = this.resize(img);
      this.centerImage();
      this.addEvents();
      this.history.push(this.image);
    });
  }

  /**
   * resize image object if it's too big
   * @returns resized version of image
   */
  resize(image) {
    if (image.width > this.imageMaxWidth) {
      const perc = this.imageMaxWidth / image.width;
      image.setWidth(this.imageMaxWidth);
      image.setHeight(image.height * perc);
      return image;
    } else if (image.height > this.imageMaxHeight) {
      const perc = this.imageMaxHeight / image.height;
      image.setHeight(this.imageMaxHeight);
      image.setWidth(image.width * perc);
      return image;
    }
    return image;
  }

  /**
   * adds events to buttons and stuff
   */
  addEvents() {
    document.getElementById("center-image")
      .addEventListener("click", () => {
        this.centerImage();
      });
    document.getElementById("undo")
      .addEventListener("click", () => {
        this.undo();
      });
    document.getElementById("redo")
      .addEventListener("click", () => {
        this.redo();
      });
    // document.getElementById("crop")
    //   .addEventListener("click", () => {
    //     this.crop();
    //   });
    this.c.on("object:modified", () => {
      this.addHistory();
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

  removeImage() {

  }

  /**
   * Crops the image to an arc. Takes the canvas and 
   * converts to a png and returns it.
   * 
   * @return the cropped canvas.
   */
  crop() {
    // make it non selectable and disable controls/borders
    // else they are seen in the cropped pic
    this.selectable = false;
    this.image.hasControls = false;
    this.image.hasBorders = false;

    // Clips the canvas in a circle instead of the pic
    // might need to adjust the radius and shit here
    const circleDiameter = 274;
    const x = this.c.width / 2 + 1;
    const y = this.c.height / 2;
    const radius = circleDiameter / 2 - 3;
    const startAngle = 0;
    const endAngle = 100;

    this.c.clipTo = function(ctx) {
      ctx.arc(x, y, radius, startAngle, endAngle);
    };
    this.c.overlayImage = null;
    this.c.renderAll();

    // Return a base64 representation of the cropped CANVAS instead of the image
    // canvas is cropped in a circle, make it a png-image and the whitespace is
    // transparent
    const cropped = this.c.toDataURL({
      format: "png",
      left: this.c.width / 2 - circleDiameter / 2,
      top: this.c.height / 2 - circleDiameter / 2,
      width: circleDiameter,
      height: circleDiameter
    });

    return cropped;
  }

  /**
   * step backwards in history
   */
  undo() {
    if (this.undoIndex !== 0) {
      this.undoIndex--;
    }
    this.c.remove(this.image); // DRY but needed or fabric will add a new copy to the canvas :S:S:S
    console.log(this.history);
    if (this.undoIndex === 0) {
      console.log("undo centered object");
      this.c.centerObject(this.image);
    } else {
      this.image = this.history[this.undoIndex - 1];
    }
    this.add();
  }

  /**
   * step forward in history, aka redo
   */
  redo() {
    if (this.undoIndex < this.history.length) {
      this.undoIndex++;

      // DRY but needed or fabric will add a new copy to the canvas :S:S:S
      this.c.remove(this.image);
      this.image = _.cloneDeep(this.history[this.undoIndex - 1]);
      this.add();
    }
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
   * center image object.
   * call add() afterwards to make the changes visible
   */
  centerImage() {
    this.c.centerObject(this.image);
    this.history.push(this.image);
    this.undoIndex = this.history.length;
    this.add();
  }

  /**
   * adds html to DOM to keep track of history
   * and undoIndex during development
   */
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
