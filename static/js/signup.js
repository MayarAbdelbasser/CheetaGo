lucide.createIcons();

document.addEventListener("DOMContentLoaded", () => {
  // toggle eye icons to show password
  setupPasswordToggle("toggle-password", "password", "icon-eye");
  setupPasswordToggle(
    "toggle-confirm-password",
    "confirm-password",
    "icon-eye-confirm",
  );

  const signupRules = [
    {
      inputId: "first-name",
      msgId: "fname-msg",
      label: "First name",
      type: "name",
    },
    {
      inputId: "last-name",
      msgId: "lname-msg",
      label: "Last name",
      type: "name",
    },
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
    {
      inputId: "confirm-password",
      msgId: "confirm-password-msg",
      label: "Confirm password",
      type: "confirmPassword",
      getRef: () => document.getElementById("password").value.trim(),
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
