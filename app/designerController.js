/* global atob Blob */

// /////////////////////////////////////////////////////////////
// Contains designer stuff considering saving, uploading etc  //
//  - maybe not really a controller but meow meow woof        //
// /////////////////////////////////////////////////////////////

import ImageUploader from "./imageUploader";
import Designer from "./designer";
import request from "superagent";

const flash = document.getElementById("designer-flash");
const flashMessage = document.getElementById("designer-flash-message");
const designsDiv = document.getElementById("designs");
const cartInfo = document.querySelector(".cart-info");
const form = document.getElementById("upload-form");
const dotDesign = document.getElementById("dot-design");
const order = document.querySelector(".order-info");
let designer = null;
console.log(order);

// checks what images need to be loaded!
// either all the designs or just the order
// if the user is in /cart
if (designsDiv) {
  const imageNodeList = designsDiv.getElementsByTagName("img");
  loadImages(imageNodeList);
} else if (cartInfo) {
  const imageNodeList = cartInfo.getElementsByTagName("img");
  loadImages(imageNodeList);
} else if (order) {
  console.log("hehe ordah");
  const imageNodeList = order.getElementsByTagName("img");
  loadImages(imageNodeList);
}

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

if (dotDesign) {
  dotDesign.onchange = function(event) {
    designer.removeImage();
    const file = document.getElementById("dot-design").files[0];
    const target = event.explicitOriginalTarget ||
                  event.relatedTarget ||
                  document.activeElement || {}; // for knowing which submit was pressed
    upload(file, target, event);
  };
}

function upload(file, target, event) {
  // TODO: Refactor
  const imageUploader = new ImageUploader();
  if (!file) {
    displayDesignerFlash();
    console.log("No file chosen");
    return;
  }

  if (target.value === form.elements["save-submit"].value) {
    const img = designer.crop();
    const blob = dataURLtoBlob(img);
    const fd = new FormData();
    fd.append("dot-design", blob, document.getElementById("dot-design").files[0].name);

    // superagent post formdata is not playing nicely with multer.
    // the fileupload NEEDS to be done with AJAX since if you submit
    // the form with the regular submit-event, the appended formdata with
    // the cropped picture does not get sent to the server.. bs
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "designer/upload");
    xhr.onload = function(event) {
      if (xhr.status === 200) {
        if (xhr.response === "unauthorized") {
          document.getElementById("form-modal-container").classList.toggle("hidden");
        } else if (xhr.response === "success") {
          window.location.href = "/profile";
        } else if (xhr.response === "deactivated") {
          console.log("Your account is not activated");
          // show a message here probably
        }
      } else {
        console.log("Error: " + xhr.status);
      }
    };
    xhr.send(fd);
  } else {
    event.preventDefault(); // Prevent submitting form on picupload to client
    imageUploader.isValidImage(file)
      .then(imageUploader.uploadToClient)
      .then((image) => {
        // toggle elements to hide/show on uploaded client pic
        form.elements["save-submit"].disabled = false;
        form.elements["dot-design"].classList.toggle("hidden");
        return image;
      })
      .then(img => designer.init(img)) // call init instead of creating the designer here
      .catch(error => {
        displayDesignerFlash("Not a valid file format");
        console.log(error);
      });
  }
}

function displayDesignerFlash(error) {
  flashMessage.innerHTML = error;
  flash.classList.remove("hidden");
  setTimeout(() => {
    hideDesignerFlash();
  }, 3000);
}

function hideDesignerFlash() {
  flash.classList.add("hidden");
  flashMessage.innerHTML = "";
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
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

function loadImages(imageNodeList) {
  Array.prototype.forEach.call(imageNodeList, img => {
    const url = "/" + img.getAttribute("data-image-url");
    console.log(url);
    request
      .get(url)
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        console.log(img.getAttribute("data-image-url"));
        img.src = "/" + img.getAttribute("data-image-url");
        img.classList.toggle("hidden");
      });
  });
}
