const fs = require("fs");



function uploadImage(image, path, callback) {

  fs.writeFile(path, image.buffer, error => {
    if (error) {
      callback(error);
    } else {
      callback();
    }
  });
}




module.exports = uploadImage;
