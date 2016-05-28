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
      
      price10.innerHTML = checkbox10.checked ? input10.value * 16 : 0;
      price11.innerHTML = checkbox11.checked ? input11.value * 16 : 0;
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


// if (cart) {
//   const tBody = cart.querySelector(".pure-table").tBodies[0];
//   const tRows = tBody.getElementsByTagName("tr");
//   _.each(tRows, row => {
//     const checkbox10 = row.querySelector(".checkbox-10mm");
//     const checkbox11 = row.querySelector(".checkbox-11mm");
//     const input10 = row.querySelector(".quantity-10mm");
//     const input11 = row.querySelector(".quantity-11mm");
//     input10.disabled = !checkbox10.checked;
//     input11.disabled = !checkbox11.checked;
//     checkbox10.onchange = () => {
//       input10.disabled = !checkbox10.checked;
//       console.log(!checkbox10.checked);
//       console.log(!checkbox10.checked);
//     };
//     checkbox11.addEventListener("change", () => {
//       input11.disabled = !checkbox11.checked;
//     });
//   }); 
// }



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

