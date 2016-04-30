const fs = require("fs");


/**
 * Uploads an image to filesystem and returns a 
 * Promise. 
 * 
 * @param image 
 * @param path 
 * @returns {Promise}
 */
function uploadImage(image, path) {
  // TOneverDO: Should probably take a buffer object as param
  return new Promise((resolve, reject) => {
    fs.writeFile(path, image.buffer, error => {
      if (error) return reject(error);
      resolve();
    });
  });
}

module.exports = uploadImage;

