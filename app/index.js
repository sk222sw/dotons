/* global atob Blob */

import DesignerController from "./designerController";
import _ from "lodash";
import request from "superagent";
import Promise from "bluebird";

const addToCartForms = document.getElementsByClassName("add-button-form");

if (addToCartForms) { // more than the login forms
  _.each(addToCartForms, (element, index) => {
    console.log(element);
    element.addEventListener("click", e => {
      e.preventDefault();
      console.log("Simulating adding the button with id " + element.buttonID.value);

      request
        .post("/add")
        .send({ buttonID: element.buttonID.value, _csrf: element._csrf.value })
        .withCredentials()
        .end((err, res) => {
          if (err) console.log(err); // handle error
          const response = JSON.parse(res.text);
          console.log(response.success);
          if (response.success) {
            console.log(response.cart);
            // do something with the cart yao
          } else {
            // Could not add, present error
          }
        });
    });
  });
}

function addToCart() {
  return new Promise((resolve, reject) => {
    
  });
}

function updateCart() {
  
}



