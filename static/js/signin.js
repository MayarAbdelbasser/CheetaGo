lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
  // toggle eye icons to show password
  setupPasswordToggle("toggle-password", "password", "icon-eye");

  const signupRules = [
    {
      inputId: "email",
      msgId: "email-msg",
      label: "Email",
      type: "email",
    },
    {
      inputId: "password",
      msgId: "password-msg",
      label: "Password",
      type: "password",
    },
  ];
  // attach the function to each input
  signupRules.forEach(attachLiveValidation);

  // validateForm function will return true or false because the every method
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = validateForm(signupRules);

    if (isValid) {
      console.log("All good — submit!");
    }
  });
});
