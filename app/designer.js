/* global fabric */

export default class Designer {
  constructor() {
    this.imageMaxHeight = 500;
    this.imageMaxWidth = 700;
  }

  initiate(base64Img) {
    // create img node and fabric canvas object
    const imageNode = document.createElement("img");
    const c = new fabric.Canvas("canvas");
    c.setHeight(500);
    c.setWidth(700);
    console.log(this.maxWidth);
    imageNode.src = base64Img;

    // center the image in canvas element
    let image = new fabric.Image(imageNode, {
      left: c.width / 2,
      top: c.height / 2
    });

    image = this.resize(image);

    // add image to canvas
    c.add(image);
  }

  resize(image) {
    if (image.width > this.imageMaxWidth || image.height > this.imageMaxHeight) {
      image.setHeight(10);
      image.setWidth(10);
      return image;
    }
    return image;
  }
}
