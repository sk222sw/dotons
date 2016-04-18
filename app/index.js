require("./stylesheets/style.scss");
import request from "superagent";

const form = document.getElementById("upload-form");
const ctx = canvas.getContext("2d");

// TODO: needs refactoring badly probably maybe

if (form) {
  if (form.addEventListener) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const file = document.getElementById("dot-design").files[0];
      const uploadButton = document.getElementById("upload-submit");
      const saveButton = document.getElementById("save-submit");
      const target = event.explicitOriginalTarget || event.relatedTarget ||
          document.activeElement || {};
        console.log(target);
        console.log

      if (target.value === uploadButton.value) {
        const reader = new FileReader();
        reader.onload = () => {
          const output = document.createElement("img");
          output.src = reader.result;
          ctx.drawImage(output, 0, 0);
        };
        reader.readAsDataURL(file);
      } else if (target.value === saveButton.value) {
        const formData = new FormData();
        formData.append("dot-design", file);

        request
          .post("/designer/upload")
          .send(formData)
          .end((err, res) => {
            console.log(res.body);
          });
      }
    }, false);
  }
}
