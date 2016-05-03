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
      .then(img => new Designer(img))
      .catch(error => {
        console.log(error);
      });
  } else if (target.value === form.elements["save-submit"].value) {

    document.getElementById("upload-form").submit();
    form.submit();
  }
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
