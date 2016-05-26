/* global atob Blob */

import DesignerController from "./designerController";
import _ from "lodash";
import request from "superagent";
import Promise from "bluebird";

const addToCartForms = document.getElementsByClassName("add-button-form");

if (addToCartForms) { // more than the login forms
  _.each(addToCartForms, (element, index) => {
    element.addEventListener("submit", e => {
      e.preventDefault();

      
      if (element.order.classList.contains("add")) {
        request
        .post("/add")
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

            // do something with the cart yao
          } else {
            // Could not add, present error
          }
        });  
      } else if (element.order.classList.contains("remove")) {
        request
          .post("/remove")
          .send({ buttonID: element.buttonID.value, _csrf: element._csrf.value })
          .withCredentials()
          .end((err, res) => {
            const response = JSON.parse(res.text);
            console.log(response);
            if(err) console.log(err) // handle error
            if (response.success) {
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

function addToCart() {
  return new Promise((resolve, reject) => {
    
  });
}

function updateCart() {
  
}



