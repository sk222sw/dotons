require("./stylesheets/style.scss");
import request from "superagent";
import ImageUploader from "./imageUploader";

// TODO: Better error-presentation for the user, flashhshhshshhs-messhahshshhages

const form = document.getElementById("upload-form");

if (form && form.addEventListener) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const file = document.getElementById("dot-design").files[0];
    const target = event.explicitOriginalTarget ||
                   event.relatedTarget ||
                   document.activeElement || {}; // for knowing which submit was pressed

    upload(file, target);
  }, false);
}

function upload(file, target) {
  const imageUploader = new ImageUploader();

  if (!file) {
    console.log("No file chosen");
    return;
  }

  if (target.value === form.elements["upload-submit"].value) {
    imageUploader.isValidImage(file)
      .then(imageUploader.uploadToClient)
      .then(imageUploader.drawPreview)
      .catch(error => {
        console.log(error);
      });
  } else if (target.value === form.elements["save-submit"].value) {
    imageUploader.uploadToServer(file)
      .then(response => {
        console.log(response.text);
      })
      .catch(error => {
        console.log(error);
      });
  }
}
