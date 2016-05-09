/* global fabric */

import _ from "lodash";

export default class Designer {
  constructor() {
    const parentNode = document.getElementById("canvas-area");
    const parentWidth = parentNode.clientWidth;
    const parentHeight = parentNode.clientHeight;

    // create fabric canvas
    this.c = new fabric.Canvas("canvas");

    this.c.setWidth(parentWidth);
    this.c.setHeight(parentHeight);

    // max dimensions
    this.imageMaxHeight = this.c.height;
    this.imageMaxWidth = this.c.width;

    // create foreground circle
    /* Old code I dare not to remove it /sasha

    const circleNode = document.createElement("img");
    circleNode.src = "./images/dot-kopia.png";
    this.circle = new fabric.Image(circleNode);
    this.circle.set({
      opacity: 0.8,
      width: this.c.width,
      height: this.c.height,
      selectable: false
    });
    this.circle = this.resize(this.circle);
    this.c.setOverlayImage(this.circle, this.c.renderAll.bind(this.c));
    */

    // New code, solves bug of not rendering circle until canvas has been clicked..
    this.circle = fabric.Image.fromURL("/images/dotty.png", image => {
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

    fabric.Image.fromURL(image, img => {
      img.globalComositeOperation = "source-atop";
      this.image = this.resize(img);
      this.centerImage();
      this.addEvents();
      this.add();
      this.history.push(this.image);
      this.c.add(img);
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
    document.getElementById("crop")
      .addEventListener("click", () => {
        this.crop();
      });
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

  /*
  * crop image to a circle
  * TODO crop when image is saved?
  */
  crop() {
    // TODO: Bugs in mobile. Seems like it crops correctly but when
    //       the image is saved it only saves like 1/4 or even less
    //       of it...

    // this.image.clipTo = function(ctx) {
    //   const horizontalOffsetFromCenter = 0;
    //   const verticalOffsetFromCenter = 0;
    //   const radius = 300; // atleast according to official Fabric demos but i dont really know what it does
    //   const iDontKnowWhatThisArgumentDoesBecauseFabricDocumentationSucks = 0;
    //   const iThinkThisHasSomethingToDoWithCirclesButImNotSure = 100;

    //   ctx.arc(horizontalOffsetFromCenter,
    //           verticalOffsetFromCenter,
    //           radius,
    //           iDontKnowWhatThisArgumentDoesBecauseFabricDocumentationSucks,
    //           iThinkThisHasSomethingToDoWithCirclesButImNotSure
    //         );
    // };

    // make it non selectable and disable controls/borders
    // else they are seen in the cropped pic
    this.selectable = false;
    this.image.hasControls = false;
    this.image.hasBorders = false;

    // Clips the canvas in a circle instead of the pic
    // might need to adjust the radius and shit here
    console.log(this.c.width);
    console.log(this.c.height);
    const x = this.c.width / 2 + 1;
    const y = this.c.height / 2;
    const radius = 272 / 2;
    const startAngle = 0;
    const endAngle = 100;
    const curcle = new fabric.Circle({ radius: 272 / 2, fill: '#f55', top: 100, left: 100 });
    this.image.clipTo = function(ctx) {
      curcle.render(ctx);
      // ctx.arc(x, y, radius, startAngle, endAngle);
    };

    this.c.renderAll();

    // Return a base64 representation of the cropped CANVAS instead of the image
    // canvas is cropped in a circle, make it a png-image and the whitespace is
    // transparent
    
    console.log(this.image);
    console.log(this.c.item(this.c.size() - 1));
    return this.c.item(this.c.size() - 1).toDataURL({
      format: "png",
      left: 0,
      top: 0
    });
  }

  /**
   * step backwards in history
   */
  undo() {
    if (this.undoIndex !== 0) {
      this.undoIndex--;
    }
    this.c.remove(this.image); // DRY but needed or fabric will add a new copy to the canvas :S:S:S
    if (this.undoIndex === 0) {
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
