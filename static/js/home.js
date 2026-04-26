// toggle novBar
const btn = document.querySelector("[data-collapse-toggle]");
const menu = document.getElementById("navbar-sticky");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});
