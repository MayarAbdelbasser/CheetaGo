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
    startButton.dataset.action = "logout";
  } else {
    startButton.textContent = "Get started";
    startButton.dataset.action = "signup";
  }

  startButton.addEventListener("click", () => {
    const action = startButton.dataset.action;
    // navigate to signup page
    if (action == "signup") {
      window.location.href = "/signup";
    } else if (action == "logout") {
      auth.logout();
    }
  });

  // navigate to tracking page
  if (window.location.pathname === "/") {
    const trackBtn = document.querySelector("#track");
    const trackInput = document.querySelector("#floating_filled");
    trackBtn.addEventListener("click", () => {
      const trackNumber = trackInput.value;
      window.location.href = `/tracking?num=${trackNumber}`;
    });
  }

  lucide.createIcons();
});
