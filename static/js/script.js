// toggle novBar
const btn = document.querySelector("[data-collapse-toggle]");
const menu = document.getElementById("navbar-sticky");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  // change the get started button to logout if user is logged in
  const startButton = document.querySelector("#start_button");
  if (auth.isLoggedIn()) {
    startButton.textContent = "Logout";
  }

  startButton.addEventListener("click", () => {
    // navigate to signup page
    if (startButton.textContent == "Get started") {
      //   window.location.href = "/signup";
      console.log("start");
    } else if (startButton.textContent == "Logout") {
      auth.logout();
    }
  });

  lucide.createIcons();
});
