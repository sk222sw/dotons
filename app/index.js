/* global atob Blob */

import DesignerController from "./designerController";
import _ from "lodash";
import request from "superagent";
import Promise from "bluebird";

const addToCartForms = document.getElementsByClassName("add-button-form");
const cartCounter = document.querySelector(".cart-count");
const cartInfo = document.querySelector(".cart-info");
const designsDiv = document.getElementById("designs");

if (designsDiv) {
  const designs = document.querySelectorAll(".design");
  const modalContainer = document.getElementById("form-modal-container");
  const modalPic = modalContainer.querySelector("#modal-pic");
  const form = modalContainer.querySelector(".add-to-cart-form");
  const submitButton = form.querySelector(".pure-button");
  const priceTag = form.querySelector(".totalPrice");

  form.selected10mm.onchange = () => {
    form.quantity10mm.disabled = !form.selected10mm.checked;
    submitButton.disabled = !form.selected10mm.checked && !form.selected11mm.checked;
  };

  form.selected11mm.addEventListener("change", () => {
    form.quantity11mm.disabled = !form.selected11mm.checked;
    submitButton.disabled = !form.selected10mm.checked && !form.selected11mm.checked;
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

  form.addEventListener("submit", e => {
    e.preventDefault();
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
        const response = JSON.parse(res.text);
        if (response.success) {
          cartCounter.innerHTML = response.cart.length;
          modalContainer.classList.toggle("hidden");
          console.log(modalContainer);
        } else {
          console.log("Could not add to cart");
        }
      });
  });
}

const cart = document.querySelector(".cart-info");
console.log(cart);
if (cart) {
  const orderItems = document.querySelectorAll(".order-item");
  const updateButton = document.querySelector(".update-order");
  updateButton.addEventListener("click", e => {
    _.each(orderItems, item => {
      console.log(item);
      const input10 = item.querySelector(".quantity-10mm");
      const input11 = item.querySelector(".quantity-11mm");
      const price10 = item.querySelector(".price-10mm");
      const price11 = item.querySelector(".price-11mm");
      const checkbox10 = item.querySelector(".checkbox-10mm");
      const checkbox11 = item.querySelector(".checkbox-11mm");
      
      price10.innerHTML = checkbox10.checked ? input10.value * 16 + " kr" : 0 + " kr";
      price11.innerHTML = checkbox11.checked ? input11.value * 16 + " kr" : 0 + " kr";
    });
  });
  
  _.each(orderItems, item => {
    item.querySelector(".remove-item").addEventListener("click", e => {
      console.log(item.querySelector(".button-id"));
      if (confirm("Are you sure?")) {
        
        
        request
          .post("/cart/remove")
          .send({
            buttonID: item.querySelector(".button-id").value,
            _csrf: document.querySelector(".csrf").value,
          })
          .withCredentials()
          .end((err, res) => {
            if (err) console.log(err);
            else {
              const response = JSON.parse(res.text);
              console.log(response);
              item.parentNode.removeChild(item);
              console.log(response.cart);
              if (response.cart.length === 0) {
                updateButton.classList.add("hidden");
                document.querySelector(".order-item-header").classList.add("hidden");
                document.querySelector(".submit").disabled = true;
                document.querySelector(".submit").classList.add("hidden");
                cart.innerHTML = "<p>There are no dots in your cart...</p>";
                cartCounter.innerHTML = response.cart.length;
                
              }
            }  
          });
      }
    });
  });     
}