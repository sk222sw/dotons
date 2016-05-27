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
        } else {
          img.src = img.getAttribute("data-image-url");
          img.classList.toggle("hidden");
        }
      });
  });
}

console.log(addToCartForms);
const designsDiv = document.getElementById("designs");
console.log(designsDiv);

if (addToCartForms && designsDiv) { // more than the login forms
  console.log("hehen prevent default shizzle");
  _.each(addToCartForms, (element, index) => {
    element.addEventListener("submit", e => {
      e.preventDefault();

      

      
      if (element.order.classList.contains("add")) {
        request
        .post("cart/add")
        .send({ buttonID: element.buttonID.value, _csrf: element._csrf.value })
        .withCredentials()
        .end((err, res) => {
          if (err) console.log(err); // handle error
          const response = JSON.parse(res.text);
          console.log(response);
          if (response.success) {
            console.log("added to cart");
            element.order.value = "Remove from cart"
            element.order.classList.remove("add");
            element.order.classList.add("remove");
            cartCounter.innerHTML = response.cart.length;
            

            // do something with the cart yao
          } else {
            // Could not add, present error
          }
        });  
      } else if (element.order.classList.contains("remove")) {
        request
          .post("/cart/remove")
          .send({ buttonID: element.buttonID.value, _csrf: element._csrf.value })
          .withCredentials()
          .end((err, res) => {
            const response = JSON.parse(res.text);
            console.log(response);
            if(err) console.log(err) // handle error
            if (response.success) {
              cartCounter.innerHTML = response.cart.length;
              console.log("removed from cart");
              
              element.order.classList.add("add");
              element.order.classList.remove("remove");
              element.order.value = "Add to cart";
            }
          });
        
      }
      
    });
  });
}

const loginModal = document.getElementById("form-modal-container");
if (loginModal.classList.contains("hidden")) {
  const loginForm = loginModal.querySelector(".login-form");
  console.log(loginForm);
  console.log(loginForm)
}




