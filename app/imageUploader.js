import request from "superagent";

export default class ImageUploader {
  constructor() {

  }

  uploadToClient(image) {
    return new Promise((resolve, reject) => {
      if (!this.isValidImage(image)) return reject("Not a valid image");

      const reader = new FileReader();
      reader.onload = resolve;
      reader.readAsDataURL(image);
    });
  }

  uploadToServer(image) {
    // Promiosify this shit to use resolve reject?
    return new Promise((resolve, reject) => {
      if (!this.isValidImage(image)) return reject("Not a valid image");

      const formData = new FormData();
      formData.append("dot-design", image);

      request
        .post("/designer/upload")
        .send(formData)
        .end((err, res) => {
          if (err) return reject("Something went wrong");
          resolve(res);
        });
    });
  }

  drawPreview(canvas, result) {
    const output = document.createElement("img");
    output.src = result;
    canvas.drawImage(output, 0, 0);
  }

  isValidImage(image) {
    console.log(image.type);
    // this checks mimi-type, sufficient enough or check extension aswell?
    return image.type === "image/jpeg" || image.type === "image/bmp" ||
           image.type === "image/gif" || image.type === "image/png";
  }
}
