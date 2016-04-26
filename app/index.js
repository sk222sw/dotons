import ImageUploader from "./imageUploader";
import Designer from "./designer";
import request from "superagent";

// TODO: Better error-presentation for the user, flashhshhshshhs-messhahshshhages
const form = document.getElementById("upload-form");

if (form && form.addEventListener) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const file = document.getElementById("dot-design").files[0];
    const target = event.explicitOriginalTarget ||
                   event.relatedTarget ||
                   document.activeElement || {}; // for knowing which submit was pressed

    upload(file, target);
  }, false);
}

function upload(file, target) {
  const imageUploader = new ImageUploader();
  const designer = new Designer();

  if (!file) {
    console.log("No file chosen");
    return;
  }

  if (target.value === form.elements["upload-submit"].value) {
    imageUploader.isValidImage(file)
      .then(imageUploader.uploadToClient)
      .then(img => designer.initiate(img))
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

/* get user images, refactor to own file l8r */
/* needs refactor badly //TODO */
const designsDiv = document.getElementById("designs");
if (designsDiv) {
  console.log(designsDiv);
  const imgs = designsDiv.getElementsByTagName("img");

  Array.prototype.forEach.call(imgs, item => {
    console.log(item.getAttribute("data-image-url"));

    request
      .get(item.getAttribute("data-image-url"))
      .end((err, res) => {
        console.log("hehlhö");
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          item.src = item.getAttribute("data-image-url");
          console.log(item);
          item.classList.toggle("hidden");
        }
      });
  });
}
