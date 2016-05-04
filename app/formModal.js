const loginButton = document.getElementById("login-button");
const loginModal = document.getElementById("login-modal");
const modalContainer = document.getElementById("form-modal-container");
const closeLoginModal = document.getElementById("button-close-form-modal");

closeLoginModal.addEventListener("click", () => {
  modalContainer.classList.add("hidden");
});

loginButton.addEventListener("click", () => {
  modalContainer.classList.toggle('hidden');
});

/**
 * close login modal when the user clicks outside the login window
 */
modalContainer.addEventListener("click", () => {
  modalContainer.classList.add("hidden");
});

/**
 * prevent login window from inheriting modalContainer click
 */
loginModal.addEventListener("click", (e) => {
  e.stopPropagation();
});

// window.addEventListener("load", () => {
//   modalContainer.classList.toggle('hidden');
// });