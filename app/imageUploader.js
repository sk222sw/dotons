import request from "superagent";
import Promise from "bluebird";

const MAX_SIZE = 10000;

export default class ImageUploader {
  uploadToClient(image) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reject("Something went wrong when uploading the file");
      };
      reader.onload = event => {
        resolve(event.currentTarget.result);
      };
      reader.readAsDataURL(image);
    });
  }

  uploadToServer(image) {
    return new Promise((resolve, reject) => {
      if (image.size > MAX_SIZE) { return reject(new Error("Image exceeds max size")); }
      const formData = new FormData();
      formData.append("dot-design", image);

      request
        .post("/designer/upload")
        .send(formData)
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  }

  isValidImage(image) {
    // http://stackoverflow.com/a/29672957 how to check the real mime-type in js
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = event => {
        const arr = (new Uint8Array(event.target.result)).subarray(0, 4);
        let header = "";

        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        let type = "";
        switch (header) {
          case "89504e47":
            type = "image/png";
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
            type = "image/jpeg";
            break;
          default:
            type = "unknown"; // Or you can use the blob.type as fallback
            break;
        }
        if (image.size > MAX_SIZE) {
          reject(new Error("Image size exceeds the max allowed"));
        } else if (type === "image/jpeg" || type === "image/png") {
          resolve(image);
        } else {
          reject(new Error("Not a valid image"));
        }
      };
      reader.readAsArrayBuffer(image);
    });
  }
}
