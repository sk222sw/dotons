require("./stylesheets/style.scss");
import request from "superagent";

const form = document.getElementById("upload-form");

if (form) {
  if (form.addEventListener) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const file = document.getElementById("upload-submit").files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const output = document.getElementById("output");
        output.src = reader.result;
      }
      reader.readAsDataURL(file);

      console.log(form);
    }, false);
  }
}
