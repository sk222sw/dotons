/* global atob Blob */

import DesignerController from "./designerController";
import _ from "lodash";
import request from "superagent";
import Promise from "bluebird";

const addToCartForms = document.getElementsByClassName("add-button-form");
const cartCounter = document.querySelector(".cart-count");
console.log(cartCounter);

const cartInfo = document.querySelector(".cart-info");
if (cartInfo) {
  const cart = cartInfo.getElementsByTagName("img");

  Array.prototype.forEach.call(cart, img => {
    request
      .get(img.getAttribute("data-image-url"))
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        img.src = img.getAttribute("data-image-url");
        img.classList.toggle("hidden");

      });
  });
}

console.log(addToCartForms);
const designsDiv = document.getElementById("designs");
if (designsDiv) {
  const designs = document.querySelectorAll(".design");
  const modalContainer = document.getElementById("form-modal-container");
  const modalPic = modalContainer.querySelector("#modal-pic");
  const form = modalContainer.querySelector(".add-to-cart-form");
  console.log(form.selected10mm);
  console.log(form.selected11mm);
  console.log(form.submit);

  form.selected10mm.onchange = () => {
    form.quantity10mm.disabled = !form.selected10mm.checked;
    console.log(!form.selected10mm.checked);
    console.log(!form.selected11mm.checked);
    form.submit.disabled = !form.selected10mm.checked && !form.selected11mm.checked;
  };


  form.selected11mm.addEventListener("change", () => {
    console.log(!form.selected10mm.checked);
    console.log(!form.selected11mm.checked);
    form.quantity11mm.disabled = !form.selected11mm.checked;
    form.submit.disabled = !form.selected10mm.checked && !form.selected11mm.checked;
  });



  _.each(designs, element => {
    element.addEventListener("click", () => {

      const dotImage = element.querySelector(".dot-image");
      const buttonID = element.querySelector(".buttonID").value;

      modalContainer.classList.toggle("hidden");
      form.buttonID.value = buttonID;
      modalPic.src = dotImage.getAttribute("data-image-url");
    });
  });
  console.log(form._csrf);

  form.addEventListener("submit", e => {
    e.preventDefault();
    console.log("Submit");
    request
      .post("cart/add")
      .send({
        buttonID: form.buttonID.value,
        _csrf: form._csrf.value,
        selected10mm: form.selected10mm.checked,
        selected11mm: form.selected11mm.checked,
        quantity10mm: form.quantity10mm.value,
        quantity11mm: form.quantity11mm.value
      })
      .end((err, res) => {
        if (err) console.log(err);
        console.log(response);
        const response = JSON.parse(res.text);
        if (response.success) {
          console.log("added to cart");
          cartCounter.innerHTML = response.cart.length;
        } else {
          console.log("Could not add to cart");
        }
      });
  });
}


// if (addToCartForms && designsDiv) { // more than the login forms
//   const loginModal = document.getElementById("login-modal");
//   const modalContainer = document.getElementById("form-modal-container");
//   const closeLoginModal = document.getElementById("button-close-form-modal");
//   console.log("hehen prevent default shizzle");
//   _.each(addToCartForms, (element, index) => {
//     element.addEventListener("click", e => {
//       e.preventDefault();



//       if (element.order.classList.contains("add")) {

//         request
//         .post("cart/add")
//         .send({ buttonID: element.buttonID.value, _csrf: element._csrf.value })
//         .withCredentials()
//         .end((err, res) => {
//           if (err) console.log(err); // handle error
//           const response = JSON.parse(res.text);
//           console.log(response);
//           if (response.success) {
//             console.log("added to cart");
//             element.order.value = "Remove from cart"
//             element.order.classList.remove("add");
//             element.order.classList.add("remove");
//             cartCounter.innerHTML = response.cart.length;


//             // do something with the cart yao
//           } else {
//             // Could not add, present error
//           }
//         });
//       } else if (element.order.classList.contains("remove")) {
//         request
//           .post("/cart/remove")
//           .send({ buttonID: element.buttonID.value, _csrf: element._csrf.value })
//           .withCredentials()
//           .end((err, res) => {
//             const response = JSON.parse(res.text);
//             console.log(response);
//             if(err) console.log(err) // handle error
//             if (response.success) {
//               cartCounter.innerHTML = response.cart.length;
//               console.log("removed from cart");

//               element.order.classList.add("add");
//               element.order.classList.remove("remove");
//               element.order.value = "Add to cart";
//             }
//           });

//       }


//     });
//   });
// }

