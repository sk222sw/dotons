const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("modal");
const modalContainer = document.getElementById("form-modal-container");
const closeLoginModal = document.getElementById("button-close-form-modal");

if (closeLoginModal) {
  closeLoginModal.addEventListener("click", () => {
    modalContainer.classList.add("hidden");
    console.log(modalContainer);
    console.log("hehehehehehehehe");
  });
}

if (loginButton) {
  loginButton.addEventListener("click", () => {
    modalContainer.classList.toggle('hidden');
  });
}

/**
 * close modal when the user clicks outside the form window
 */
if (modalContainer) {
  modalContainer.addEventListener("click", () => {
  modalContainer.classList.add("hidden");
});  
}


/**
 * prevent form window from inheriting modalContainer click
 */
if (loginModal) {
  loginModal.addEventListener("click", (e) => {
    e.stopPropagation();
  });  
}

