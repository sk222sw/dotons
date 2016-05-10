/* global atob Blob */

import ImageUploader from "./imageUploader";
import Designer from "./designer";
import request from "superagent";

// TODO: Better error-presentation for the user, flashhshhshshhs-messhahshshhages
const form = document.getElementById("upload-form");
// declare designer here. Might need to call crop method
// on saving the image
let designer = null;

if (form && form.addEventListener) {
  designer = new Designer();
  form.addEventListener("submit", event => {
    event.preventDefault();
    const file = document.getElementById("dot-design").files[0];
    const target = event.explicitOriginalTarget ||
                   event.relatedTarget ||
                   document.activeElement || {}; // for knowing which submit was pressed

    upload(file, target, event);
  }, false);

}

function upload(file, target, event) {
  const imageUploader = new ImageUploader();
  if (!file) {
    console.log("No file chosen");
    return;
  }

  if (target.value === form.elements["upload-submit"].value) {
    event.preventDefault(); // Prevent submitting form on picupload to client
    imageUploader.isValidImage(file)
      .then(imageUploader.uploadToClient)
      .then((image) => {
        // toggle elements to hide/show on uploaded client pic
        form.elements["upload-submit"].classList.toggle("hidden");
        form.elements["save-submit"].classList.toggle("hidden");
        form.elements["dot-design"].classList.toggle("hidden");
        return image;
      })
      .then(img => designer.init(img)) // call init instead of creating the designer here
      .catch(error => {
        console.log(error);
      });
  } else if (target.value === form.elements["save-submit"].value) {

    const img = designer.crop();
    const blob = dataURLtoBlob(img);
    const fd = new FormData();
    fd.set("dot-design", blob, document.getElementById("dot-design").files[0].name);
    
    // superagent post formdata is not playing nicely with multer.
    // the fileupload NEEDS to be done with AJAX since if you submit
    // the form with the regular submit-event, the appended formdata with
    // the cropped picture does not get sent to the server.. bs

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "designer/upload");
    xhr.onload = function(event) {
      if (xhr.status === 200) {
        console.log(xhr);

        if (xhr.response === "unauthorized") {
          document.getElementById("form-modal-container").classList.toggle("hidden");
        } else if (xhr.response === "success") {
          window.location.href = "/profile";
        }
      } else {
        console.log("Error: " + xhr.status);
      }
    }
    xhr.send(fd);
  }
}

function dataURLtoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }
  // separate out the mime component
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

/* get user images, refactor to own file l8r */
/* needs refactor badly //TODO */
const designsDiv = document.getElementById("designs");
if (designsDiv) {

  const imgs = designsDiv.getElementsByTagName("img");

  Array.prototype.forEach.call(imgs, item => {


    request
      .get(item.getAttribute("data-image-url"))
      .end((err, res) => {

        if (err) {
          console.log(err);
        } else {

          item.src = item.getAttribute("data-image-url");

          item.classList.toggle("hidden");
        }
      });
  });
}
