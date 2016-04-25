/* global fabric */

export default class Designer {
  constructor(form, canvas) {
    this.form = form;
    console.log("contrsturcer");
  }

  initiate(base64Img) {
    const imageNode = document.createElement("img");
    const c = new fabric.Canvas("canvas");
    imageNode.src = base64Img;
    console.log(imageNode);
    const image = new fabric.Image(imageNode, {
      left: canvas.width / 2,
      top: canvas.height / 2
    });
    c.add(image);
  }
}
