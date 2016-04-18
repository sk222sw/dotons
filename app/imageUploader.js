import request from "superagent";

export class ImageUploader {
  constructor(form) {
    this.form = form;
  }

  uploadToClient(image) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = resolve;
      reader.readAsDataURL(image);
    })
  }

  uploadToServer(image) {

  }

  validateImage(image) {
  }
}
